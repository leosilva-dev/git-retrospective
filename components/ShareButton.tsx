"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  slideTitle?: string;
  username?: string;
}

export default function ShareButton({ slideTitle = "Minha Retrospectiva Git", username }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentYear = new Date().getFullYear();
  
  // Construct share URL with username query param if needed
  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    
    const url = new URL(window.location.href);
    // If username provided and not in params, add it
    if (username && !url.searchParams.has("username") && !url.searchParams.has("u")) {
      url.searchParams.set("username", username);
    }
    return url.toString();
  };

  const shareText = `${slideTitle} 🚀\n\nCrie a sua retrospectiva também:`;

  const shareToTwitter = () => {
    const shareUrl = getShareUrl();
    const twitterUrl = new URL("https://twitter.com/intent/tweet");
    twitterUrl.searchParams.set("text", shareText);
    twitterUrl.searchParams.set("url", shareUrl);
    
    window.open(twitterUrl.toString(), "_blank", "width=550,height=420");
    setIsOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 share-button-container">
      {/* Main Share Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white shadow-lg hover:bg-white/30 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Compartilhar"
      >
        <ShareIcon />
      </motion.button>

      {/* Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-xl rounded-2xl p-4 min-w-[220px] shadow-2xl border border-white/20"
          >
            <p className="text-white/70 text-sm mb-3 font-medium">Compartilhar</p>
            
            {/* Twitter/X Button */}
            <button
              onClick={shareToTwitter}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <XIcon />
              <span className="font-medium">Twitter / X</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <LinkIcon />
              <span className="font-medium">
                {copied ? "Link copiado! ✓" : "Copiar Link"}
              </span>
            </button>

            {/* Info about OG image */}
            <p className="text-white/50 text-xs mt-3 px-2">
              O link inclui preview automático quando compartilhado
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// SVG Icons
function ShareIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16,6 12,2 8,6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
