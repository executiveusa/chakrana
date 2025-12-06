import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";
import { medusaStore, generateMessageId } from "../../lib/medusa";
import type {
  ChatMessage,
  AvatarEmotion,
  StorefrontChatResponse,
  SuggestedAction,
} from "../../types/medusa";

interface AvatarChatWidgetProps {
  className?: string;
  avatarName?: string;
  avatarImage?: string;
  initialMessage?: string;
  position?: "bottom-right" | "bottom-left";
  onSuggestedAction?: (action: SuggestedAction) => void;
}

/**
 * Get emoji for avatar emotion
 */
function getEmotionEmoji(emotion: AvatarEmotion): string {
  const emotionEmojis: Record<AvatarEmotion, string> = {
    neutral: "😊",
    happy: "😄",
    excited: "🎉",
    curious: "🤔",
    thinking: "💭",
    reassuring: "🤗",
    apologetic: "😅",
  };
  return emotionEmojis[emotion] || "😊";
}

/**
 * Get color class for avatar emotion
 */
function getEmotionColor(emotion: AvatarEmotion): string {
  const colors: Record<AvatarEmotion, string> = {
    neutral: "bg-purple-100 border-purple-300",
    happy: "bg-green-100 border-green-300",
    excited: "bg-yellow-100 border-yellow-300",
    curious: "bg-blue-100 border-blue-300",
    thinking: "bg-indigo-100 border-indigo-300",
    reassuring: "bg-pink-100 border-pink-300",
    apologetic: "bg-orange-100 border-orange-300",
  };
  return colors[emotion] || "bg-purple-100 border-purple-300";
}

const AvatarChatWidget: React.FC<AvatarChatWidgetProps> = ({
  className,
  avatarName = "Chakrana Guide",
  avatarImage = "https://api.dicebear.com/7.x/bottts/svg?seed=chakrana&backgroundColor=c084fc",
  initialMessage = "Hi! 🌟 I'm your Chakrana wellness guide. How can I help you on your journey today?",
  position = "bottom-right",
  onSuggestedAction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<AvatarEmotion>("happy");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: initialMessage,
        timestamp: new Date(),
        emotion: "happy",
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, initialMessage, messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setCurrentEmotion("thinking");

    try {
      const response: StorefrontChatResponse =
        await medusaStore.sendToStoreAvatar(userMessage.content);

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: response.avatar_reply.reply_text,
        timestamp: new Date(),
        emotion: response.avatar_reply.emotion,
        animation_key: response.avatar_reply.animation_key,
        suggested_actions: response.suggested_actions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentEmotion(response.avatar_reply.emotion);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content:
          "I'm having a moment of reflection. Please try again in a few seconds! 🙏",
        timestamp: new Date(),
        emotion: "apologetic",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setCurrentEmotion("apologetic");
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedActionClick = (action: SuggestedAction) => {
    if (onSuggestedAction) {
      onSuggestedAction(action);
    }
  };

  const positionClasses = {
    "bottom-right": "right-4 bottom-4",
    "bottom-left": "left-4 bottom-4",
  };

  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-green-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="relative"
                >
                  <img
                    src={avatarImage}
                    alt={avatarName}
                    className="w-10 h-10 rounded-full bg-white p-1"
                  />
                  <span className="absolute -bottom-1 -right-1 text-lg">
                    {getEmotionEmoji(currentEmotion)}
                  </span>
                </motion.div>
                <div>
                  <h3 className="font-semibold text-white">{avatarName}</h3>
                  <p className="text-xs text-purple-100">
                    Your wellness companion
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2 shadow-sm",
                        message.role === "user"
                          ? "bg-purple-600 text-white rounded-br-md"
                          : cn(
                              "border rounded-bl-md",
                              message.emotion
                                ? getEmotionColor(message.emotion)
                                : "bg-gray-100 border-gray-200"
                            )
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>

                      {/* Suggested Actions */}
                      {message.suggested_actions &&
                        message.suggested_actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggested_actions.map((action, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="text-xs bg-white hover:bg-purple-50"
                                onClick={() =>
                                  handleSuggestedActionClick(action)
                                }
                              >
                                {action.type === "go_to_checkout" && (
                                  <>
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    Checkout
                                  </>
                                )}
                                {action.type === "show_product" && "View Products"}
                                {action.type === "show_blog_post" && "Read Article"}
                              </Button>
                            ))}
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-purple-100 border border-purple-200 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                        <span className="text-sm text-purple-600">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 border-purple-200 focus-visible:ring-purple-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors",
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-700 hover:to-green-600"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default AvatarChatWidget;
