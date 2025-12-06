import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from "typeorm";
import { BlogPost } from "./blog-post";

@Entity("blog_tag")
export class BlogTag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @ManyToMany(() => BlogPost, (post) => post.tags)
  posts: BlogPost[];
}
