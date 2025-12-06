import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager, In, Like, Repository } from "typeorm";
import { BlogPost, BlogPostStatus } from "../models/blog-post";
import { BlogTag } from "../models/blog-tag";

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  body_markdown: string;
  author_id?: string | null;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  tag_slugs?: string[];
}

export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  body_markdown?: string;
  status?: BlogPostStatus;
  author_id?: string | null;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  tag_slugs?: string[];
}

export interface ListBlogPostsParams {
  status?: BlogPostStatus;
  q?: string;
  tag_slugs?: string[];
  limit?: number;
  offset?: number;
}

class BlogService extends TransactionBaseService {
  protected postRepository_: Repository<BlogPost>;
  protected tagRepository_: Repository<BlogTag>;

  constructor(container: Record<string, unknown>) {
    super(container);
    this.postRepository_ = this.manager_.getRepository(BlogPost);
    this.tagRepository_ = this.manager_.getRepository(BlogTag);
  }

  /**
   * List published blog posts (for storefront)
   */
  async listPublished(params: ListBlogPostsParams = {}): Promise<{
    posts: BlogPost[];
    count: number;
  }> {
    const { q, tag_slugs, limit = 10, offset = 0 } = params;

    const queryBuilder = this.postRepository_
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.tags", "tag")
      .where("post.status = :status", { status: BlogPostStatus.PUBLISHED })
      .orderBy("post.published_at", "DESC")
      .skip(offset)
      .take(limit);

    if (q) {
      queryBuilder.andWhere(
        "(post.title ILIKE :q OR post.body_markdown ILIKE :q OR post.excerpt ILIKE :q)",
        { q: `%${q}%` }
      );
    }

    if (tag_slugs && tag_slugs.length > 0) {
      queryBuilder.andWhere("tag.slug IN (:...tag_slugs)", { tag_slugs });
    }

    const [posts, count] = await queryBuilder.getManyAndCount();
    return { posts, count };
  }

  /**
   * Get a single published post by slug (for storefront)
   */
  async getPublishedBySlug(slug: string): Promise<BlogPost | null> {
    return this.postRepository_.findOne({
      where: { slug, status: BlogPostStatus.PUBLISHED },
      relations: ["tags"],
    });
  }

  /**
   * List all posts with optional filters (for admin)
   */
  async list(params: ListBlogPostsParams = {}): Promise<{
    posts: BlogPost[];
    count: number;
  }> {
    const { status, q, tag_slugs, limit = 20, offset = 0 } = params;

    const queryBuilder = this.postRepository_
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.tags", "tag")
      .orderBy("post.updated_at", "DESC")
      .skip(offset)
      .take(limit);

    if (status) {
      queryBuilder.andWhere("post.status = :status", { status });
    }

    if (q) {
      queryBuilder.andWhere(
        "(post.title ILIKE :q OR post.body_markdown ILIKE :q OR post.excerpt ILIKE :q)",
        { q: `%${q}%` }
      );
    }

    if (tag_slugs && tag_slugs.length > 0) {
      queryBuilder.andWhere("tag.slug IN (:...tag_slugs)", { tag_slugs });
    }

    const [posts, count] = await queryBuilder.getManyAndCount();
    return { posts, count };
  }

  /**
   * Get a single post by ID (for admin)
   */
  async retrieve(id: string): Promise<BlogPost | null> {
    return this.postRepository_.findOne({
      where: { id },
      relations: ["tags"],
    });
  }

  /**
   * Create a draft blog post
   */
  async create(data: CreateBlogPostInput): Promise<BlogPost> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const postRepo = manager.getRepository(BlogPost);
      const tagRepo = manager.getRepository(BlogTag);

      let tags: BlogTag[] = [];
      if (data.tag_slugs && data.tag_slugs.length > 0) {
        tags = await this.findOrCreateTags(tagRepo, data.tag_slugs);
      }

      const post = postRepo.create({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? null,
        body_markdown: data.body_markdown,
        author_id: data.author_id ?? null,
        hero_image_url: data.hero_image_url ?? null,
        seo_title: data.seo_title ?? null,
        seo_description: data.seo_description ?? null,
        status: BlogPostStatus.DRAFT,
        tags,
      });

      return postRepo.save(post);
    });
  }

  /**
   * Update a blog post
   */
  async update(id: string, data: UpdateBlogPostInput): Promise<BlogPost> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const postRepo = manager.getRepository(BlogPost);
      const tagRepo = manager.getRepository(BlogTag);

      const post = await postRepo.findOne({
        where: { id },
        relations: ["tags"],
      });

      if (!post) {
        throw new Error(`Blog post with ID ${id} not found`);
      }

      // Handle status change to published
      if (data.status === BlogPostStatus.PUBLISHED && post.status !== BlogPostStatus.PUBLISHED) {
        post.published_at = new Date();
      }

      // Handle tags
      if (data.tag_slugs !== undefined) {
        post.tags = data.tag_slugs.length > 0
          ? await this.findOrCreateTags(tagRepo, data.tag_slugs)
          : [];
      }

      // Update fields
      if (data.title !== undefined) post.title = data.title;
      if (data.slug !== undefined) post.slug = data.slug;
      if (data.excerpt !== undefined) post.excerpt = data.excerpt;
      if (data.body_markdown !== undefined) post.body_markdown = data.body_markdown;
      if (data.status !== undefined) post.status = data.status;
      if (data.author_id !== undefined) post.author_id = data.author_id;
      if (data.hero_image_url !== undefined) post.hero_image_url = data.hero_image_url;
      if (data.seo_title !== undefined) post.seo_title = data.seo_title;
      if (data.seo_description !== undefined) post.seo_description = data.seo_description;

      return postRepo.save(post);
    });
  }

  /**
   * Delete a blog post
   */
  async delete(id: string): Promise<void> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const postRepo = manager.getRepository(BlogPost);
      await postRepo.delete(id);
    });
  }

  /**
   * List all tags
   */
  async listTags(): Promise<BlogTag[]> {
    return this.tagRepository_.find({
      order: { name: "ASC" },
    });
  }

  /**
   * Find or create tags by slug
   */
  private async findOrCreateTags(
    tagRepo: Repository<BlogTag>,
    slugs: string[]
  ): Promise<BlogTag[]> {
    const existingTags = await tagRepo.find({
      where: { slug: In(slugs) },
    });

    const existingSlugs = existingTags.map((t) => t.slug);
    const newSlugs = slugs.filter((s) => !existingSlugs.includes(s));

    const newTags: BlogTag[] = [];
    for (const slug of newSlugs) {
      const tag = tagRepo.create({
        slug,
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      });
      newTags.push(await tagRepo.save(tag));
    }

    return [...existingTags, ...newTags];
  }
}

export default BlogService;
