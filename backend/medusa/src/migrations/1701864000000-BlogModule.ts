import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class BlogModule1701864000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create blog_tag table
    await queryRunner.createTable(
      new Table({
        name: "blog_tag",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "slug",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
          },
        ],
      }),
      true
    );

    // Create blog_post table
    await queryRunner.createTable(
      new Table({
        name: "blog_post",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "slug",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "title",
            type: "varchar",
            length: "500",
          },
          {
            name: "excerpt",
            type: "text",
            isNullable: true,
          },
          {
            name: "body_markdown",
            type: "text",
          },
          {
            name: "status",
            type: "enum",
            enum: ["draft", "published", "archived"],
            default: "'draft'",
          },
          {
            name: "published_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "author_id",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "hero_image_url",
            type: "varchar",
            length: "1000",
            isNullable: true,
          },
          {
            name: "seo_title",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "seo_description",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create blog_post_tags join table
    await queryRunner.createTable(
      new Table({
        name: "blog_post_tags",
        columns: [
          {
            name: "post_id",
            type: "uuid",
          },
          {
            name: "tag_id",
            type: "uuid",
          },
        ],
      }),
      true
    );

    // Add primary key to join table
    await queryRunner.query(`
      ALTER TABLE blog_post_tags
      ADD CONSTRAINT "PK_blog_post_tags"
      PRIMARY KEY (post_id, tag_id)
    `);

    // Add foreign key from blog_post_tags to blog_post
    await queryRunner.createForeignKey(
      "blog_post_tags",
      new TableForeignKey({
        columnNames: ["post_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "blog_post",
        onDelete: "CASCADE",
      })
    );

    // Add foreign key from blog_post_tags to blog_tag
    await queryRunner.createForeignKey(
      "blog_post_tags",
      new TableForeignKey({
        columnNames: ["tag_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "blog_tag",
        onDelete: "CASCADE",
      })
    );

    // Create indexes for common queries
    await queryRunner.query(`
      CREATE INDEX "IDX_blog_post_status" ON blog_post (status);
      CREATE INDEX "IDX_blog_post_published_at" ON blog_post (published_at);
      CREATE INDEX "IDX_blog_post_created_at" ON blog_post (created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_blog_post_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_blog_post_published_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_blog_post_created_at"`);

    // Drop join table (will also drop foreign keys)
    await queryRunner.dropTable("blog_post_tags", true, true, true);

    // Drop blog_post table
    await queryRunner.dropTable("blog_post", true, true, true);

    // Drop blog_tag table
    await queryRunner.dropTable("blog_tag", true, true, true);
  }
}
