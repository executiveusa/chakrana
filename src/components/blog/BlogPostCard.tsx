import React from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import type { BlogPost } from "../../types/medusa";

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
  onReadMore?: (slug: string) => void;
}

/**
 * Format date for display
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  className,
  onReadMore,
}) => {
  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(post.slug);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn("h-full", className)}
    >
      <Card className="h-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        {post.hero_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.hero_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <CardHeader className="pb-2">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.slug}
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 text-xs hover:bg-purple-200"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          {post.excerpt && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            {post.published_at && (
              <div className="flex items-center text-gray-400 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(post.published_at)}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 group"
              onClick={handleReadMore}
            >
              Read more
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogPostCard;
