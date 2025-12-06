import { Router, Request, Response, NextFunction } from "express";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import BlogService from "../services/blog-service";
import { BlogPostStatus } from "../models/blog-post";

/**
 * Storefront blog routes
 * These routes are accessible without authentication
 */
export function storefrontBlogRoutes(router: Router): Router {
  const blogRouter = Router();

  /**
   * GET /store/blog/posts
   * List published blog posts
   */
  blogRouter.get("/posts", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const { q, tag, limit, offset } = req.query;

      const result = await blogService.listPublished({
        q: q as string | undefined,
        tag_slugs: tag ? (tag as string).split(",") : undefined,
        limit: limit ? parseInt(limit as string, 10) : 10,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });

      res.json({
        posts: result.posts.map(formatPostForStorefront),
        count: result.count,
        offset: offset ? parseInt(offset as string, 10) : 0,
        limit: limit ? parseInt(limit as string, 10) : 10,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  /**
   * GET /store/blog/posts/:slug
   * Get a single published post by slug
   */
  blogRouter.get("/posts/:slug", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const { slug } = req.params;

      const post = await blogService.getPublishedBySlug(slug);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json({ post: formatPostForStorefront(post) });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  /**
   * GET /store/blog/tags
   * List all tags
   */
  blogRouter.get("/tags", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const tags = await blogService.listTags();

      res.json({ tags });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  router.use("/store/blog", blogRouter);
  return router;
}

/**
 * Admin blog routes
 * These routes require admin authentication
 */
export function adminBlogRoutes(router: Router): Router {
  const blogRouter = Router();

  /**
   * GET /admin/blog/posts
   * List all blog posts with filters
   */
  blogRouter.get("/posts", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const { status, q, tag, limit, offset } = req.query;

      const result = await blogService.list({
        status: status as BlogPostStatus | undefined,
        q: q as string | undefined,
        tag_slugs: tag ? (tag as string).split(",") : undefined,
        limit: limit ? parseInt(limit as string, 10) : 20,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });

      res.json({
        posts: result.posts,
        count: result.count,
        offset: offset ? parseInt(offset as string, 10) : 0,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  /**
   * GET /admin/blog/posts/:id
   * Get a single post by ID
   */
  blogRouter.get("/posts/:id", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const { id } = req.params;

      const post = await blogService.retrieve(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json({ post });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  /**
   * POST /admin/blog/posts
   * Create a new draft post
   */
  blogRouter.post("/posts", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const { title, slug, excerpt, body_markdown, hero_image_url, seo_title, seo_description, tag_slugs } = req.body;

      if (!title || !slug || !body_markdown) {
        return res.status(400).json({
          message: "title, slug, and body_markdown are required",
        });
      }

      const post = await blogService.create({
        title,
        slug,
        excerpt,
        body_markdown,
        hero_image_url,
        seo_title,
        seo_description,
        tag_slugs,
      });

      res.status(201).json({ post });
    } catch (error: any) {
      if (error.code === "23505") {
        // Unique constraint violation
        return res.status(409).json({ message: "A post with this slug already exists" });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  /**
   * PATCH /admin/blog/posts/:id
   * Update a post
   */
  blogRouter.patch("/posts/:id", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const { id } = req.params;
      const { title, slug, excerpt, body_markdown, status, hero_image_url, seo_title, seo_description, tag_slugs } = req.body;

      const post = await blogService.update(id, {
        title,
        slug,
        excerpt,
        body_markdown,
        status,
        hero_image_url,
        seo_title,
        seo_description,
        tag_slugs,
      });

      res.json({ post });
    } catch (error: any) {
      if (error.message?.includes("not found")) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      if (error.code === "23505") {
        return res.status(409).json({ message: "A post with this slug already exists" });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  /**
   * DELETE /admin/blog/posts/:id
   * Delete a post
   */
  blogRouter.delete("/posts/:id", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const blogService: BlogService = req.scope.resolve("blogService");
      const { id } = req.params;

      await blogService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  router.use("/admin/blog", blogRouter);
  return router;
}

/**
 * Format a blog post for storefront consumption
 * (removes internal fields like author_id)
 */
function formatPostForStorefront(post: any) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body_markdown: post.body_markdown,
    hero_image_url: post.hero_image_url,
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    published_at: post.published_at,
    tags: post.tags?.map((t: any) => ({ slug: t.slug, name: t.name })) || [],
  };
}
