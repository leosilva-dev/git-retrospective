"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";
import WrappedSlides from "@/components/WrappedSlides";
import LoadingScreen from "@/components/LoadingScreen";

export default function WrappedUserSlidePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  
  const slideParam = params.slide as string;
  const initialSlide = parseInt(slideParam, 10) - 1; // Convert to 0-indexed
  
  // For the actual page content, we ONLY show the logged-in user's data (privacy)
  // The username query param (if present) is ignored here and only used by page.tsx request for OG Meta
  const username = session?.username;
  
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (status === "loading") return;

      // If not logged in, redirect to home (landing page)
      // This serves as the "viral loop": click link -> go to home to make your own
      if (!username) {
         window.location.href = "/";
         return;
      }

      try {
        const response = await fetch(`/api/github/stats?username=${encodeURIComponent(username)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch GitHub data");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch GitHub data");
      } finally {
        setIsLoading(false);
        // Clean URL to hide the ID/Username param (cosmetic privacy)
        if (typeof window !== 'undefined' && window.location.search) {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    };

    fetchData();
  }, [status, username]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-900/20 via-[#121212] to-orange-900/20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="text-8xl mb-6"
          >
            😔
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-4">Algo deu errado</h1>
          <p className="text-xl text-gray-300 mb-8">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#1DB954] text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-[#1ED760] hover:scale-105 transition-all shadow-[0_8px_32px_rgba(29,185,84,0.4)]"
          >
            Tentar Novamente
          </button>
        </motion.div>
      </main>
    );
  }

  if (!stats) return null;

  return <WrappedSlides stats={stats} username={username || undefined} initialSlide={initialSlide} />;
}
