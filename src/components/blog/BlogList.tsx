import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, BookOpen, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import BlogPostCard from "./BlogPostCard";
import { medusaStore } from "../../lib/medusa";
import type { BlogPost, BlogTag } from "../../types/medusa";
import { cn } from "../../lib/utils";

interface BlogListProps {
  className?: string;
  limit?: number;
  showSearch?: boolean;
  showTags?: boolean;
  onPostClick?: (slug: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({
  className,
  limit = 6,
  showSearch = true,
  showTags = true,
  onPostClick,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts and tags
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [postsResponse, tagsResponse] = await Promise.all([
          medusaStore.listBlogPosts({
            limit,
            q: searchQuery || undefined,
            tag: selectedTag || undefined,
          }),
          showTags ? medusaStore.listBlogTags() : Promise.resolve({ tags: [] }),
        ]);

        setPosts(postsResponse.posts);
        setTags(tagsResponse.tags);
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
        setError("Unable to load blog posts. Please try again later.");
        // Set demo posts for development
        setPosts(getDemoPosts());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [limit, searchQuery, selectedTag, showTags]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is triggered by useEffect when searchQuery changes
  };

  const handleTagClick = (tagSlug: string) => {
    setSelectedTag(selectedTag === tagSlug ? null : tagSlug);
  };

  const handlePostClick = (slug: string) => {
    if (onPostClick) {
      onPostClick(slug);
    } else {
      // Default behavior: navigate to blog post
      window.location.href = `/blog/${slug}`;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
            Wellness Insights
          </h2>
        </div>
        <p className="text-gray-600">
          Explore our collection of articles on chakra healing, meditation, and
          holistic wellness.
        </p>
      </motion.div>

      {/* Search and Tags */}
      {(showSearch || showTags) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {showSearch && (
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-purple-200 focus-visible:ring-purple-500"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Search
              </Button>
            </form>
          )}

          {showTags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.slug}
                  variant={selectedTag === tag.slug ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedTag === tag.slug
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "hover:bg-purple-50 text-purple-600 border-purple-200"
                  )}
                  onClick={() => handleTagClick(tag.slug)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading articles...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">{error}</p>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <BlogPostCard post={post} onReadMore={handlePostClick} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && !error && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No articles found.</p>
          {(searchQuery || selectedTag) && (
            <Button
              variant="link"
              className="text-purple-600 mt-2"
              onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Demo posts for development when API is not available
 */
function getDemoPosts(): BlogPost[] {
  return [
    {
      id: "demo-1",
      slug: "understanding-your-seven-chakras",
      title: "Understanding Your Seven Chakras: A Complete Beginner's Guide",
      excerpt:
        "Discover the seven energy centers that influence your physical, emotional, and spiritual well-being.",
      body_markdown: "",
      hero_image_url:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
      published_at: new Date().toISOString(),
      tags: [
        { slug: "chakra-healing", name: "Chakra Healing" },
        { slug: "beginners-guide", name: "Beginner's Guide" },
      ],
    },
    {
      id: "demo-2",
      slug: "morning-meditation-routine-energy",
      title: "The 10-Minute Morning Meditation That Will Transform Your Energy",
      excerpt:
        "Start your day with intention and balanced energy with this simple morning practice.",
      body_markdown: "",
      hero_image_url:
        "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80",
      published_at: new Date().toISOString(),
      tags: [
        { slug: "meditation", name: "Meditation" },
        { slug: "wellness", name: "Wellness" },
      ],
    },
    {
      id: "demo-3",
      slug: "crystals-for-chakra-balancing",
      title: "Essential Crystals for Each Chakra: Your Complete Healing Guide",
      excerpt:
        "Learn which crystals correspond to each of your seven chakras and how to use them.",
      body_markdown: "",
      hero_image_url:
        "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=600&q=80",
      published_at: new Date().toISOString(),
      tags: [
        { slug: "crystal-healing", name: "Crystal Healing" },
        { slug: "chakra-healing", name: "Chakra Healing" },
      ],
    },
  ];
}

export default BlogList;
