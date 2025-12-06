import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { BlogTag } from "./blog-tag";

export enum BlogPostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

@Entity("blog_post")
export class BlogPost {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  excerpt: string | null;

  @Column({ type: "text" })
  body_markdown: string;

  @Column({
    type: "enum",
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus;

  @Column({ type: "timestamp", nullable: true })
  published_at: Date | null;

  @Column({ nullable: true })
  author_id: string | null;

  @Column({ nullable: true })
  hero_image_url: string | null;

  @Column({ nullable: true })
  seo_title: string | null;

  @Column({ type: "text", nullable: true })
  seo_description: string | null;

  @ManyToMany(() => BlogTag, (tag) => tag.posts, { cascade: true })
  @JoinTable({
    name: "blog_post_tags",
    joinColumn: { name: "post_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags: BlogTag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
