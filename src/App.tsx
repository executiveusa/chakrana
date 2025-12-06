import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { AvatarChatWidget } from "./components/avatar";
import type { SuggestedAction } from "./types/medusa";

function App() {
  // Handle suggested actions from the avatar chat
  const handleSuggestedAction = (action: SuggestedAction) => {
    switch (action.type) {
      case "go_to_checkout":
        window.location.href = "/checkout";
        break;
      case "show_product":
        window.location.href = `/store/${(action.payload as any).category || ""}`;
        break;
      case "show_blog_post":
        window.location.href = `/blog/${(action.payload as any).slug || ""}`;
        break;
      default:
        break;
    }
  };

  return (
    <MotionConfig>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-b from-purple-50 to-green-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center shadow-glow animate-pulse-slow"
            >
              <span className="text-white font-bold text-2xl">C</span>
            </motion.div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        
        {/* Autonomous Sales Avatar Chat Widget */}
        <AvatarChatWidget
          avatarName="Chakrana Guide"
          avatarImage="https://api.dicebear.com/7.x/bottts/svg?seed=chakrana&backgroundColor=c084fc"
          initialMessage="Hi! 🌟 I'm your Chakrana wellness guide. I can help you discover chakra healing products, meditation tools, and wellness resources. What brings you here today?"
          position="bottom-right"
          onSuggestedAction={handleSuggestedAction}
        />
      </Suspense>
    </MotionConfig>
  );
}

export default App;
