"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubStats } from "@/types/github";
import {
  IntroSlide,
  TotalCommitsSlide,
  TopLanguageSlide,
  CodingPatternSlide,
  FavoriteRepoSlide,
  LinesOfCodeSlide,
  DeveloperProfileSlide,
  SummarySlide,
} from "@/components/slides";
import SlideNavigation from "@/components/SlideNavigation";

interface Props {
  stats: GitHubStats;
  username?: string;
  initialSlide?: number;
}

export default function WrappedSlides({ stats, username, initialSlide = 0 }: Props) {
  const pathname = usePathname();
  const totalSlides = 8;

  // Parse initial slide from URL or prop
  const getInitialSlide = useCallback(() => {
    if (initialSlide > 0) return initialSlide;
    
    // Try to get slide from current pathname (handles both /wrapped/1 and /wrapped/user/1)
    const match = pathname?.match(/\/(\d+)$/);
    if (match) {
      const slideNum = parseInt(match[1], 10) - 1; // Convert to 0-indexed
      if (slideNum >= 0 && slideNum < totalSlides) {
        return slideNum;
      }
    }
    return 0;
  }, [pathname, initialSlide]);

  const [currentSlide, setCurrentSlide] = useState(getInitialSlide);

  // Update URL without navigation (shallow routing)
  const updateUrl = useCallback((slideIndex: number) => {
    const slideNumber = slideIndex + 1; // Convert to 1-indexed for URL
    const basePath = username ? `/wrapped/${username}` : '/wrapped';
    const newUrl = `${basePath}/${slideNumber}`;
    window.history.pushState(null, "", newUrl);
  }, [username]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);
      updateUrl(newSlide);
    }
  }, [currentSlide, totalSlides, updateUrl]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      const newSlide = currentSlide - 1;
      setCurrentSlide(newSlide);
      updateUrl(newSlide);
    }
  }, [currentSlide, updateUrl]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
      updateUrl(index);
    }
  }, [totalSlides, updateUrl]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/\/(\d+)$/);
      if (match) {
        const slideNum = parseInt(match[1], 10) - 1;
        if (slideNum >= 0 && slideNum < totalSlides) {
          setCurrentSlide(slideNum);
        }
      } else if (window.location.pathname.match(/\/wrapped(\/[^/]+)?$/)) {
        setCurrentSlide(0);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [totalSlides]);

  // Set initial URL on mount
  useEffect(() => {
    if (pathname === "/wrapped" || !pathname?.includes("/wrapped/")) {
      updateUrl(currentSlide);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextSlide, prevSlide]);

  // Background gradients for each slide - Spotify Wrapped style
  const backgrounds = [
    "bg-linear-to-br from-[#1DB954] via-[#1ED760] to-emerald-400",
    "bg-linear-to-br from-purple-600 via-violet-600 to-fuchsia-600",
    "bg-linear-to-br from-[#1DB954] via-teal-500 to-cyan-500",
    "bg-linear-to-br from-pink-600 via-rose-500 to-orange-500",
    "bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600",
    "bg-linear-to-br from-[#1DB954] via-emerald-500 to-teal-600",
    "bg-linear-to-br from-orange-500 via-pink-500 to-purple-600",
    "bg-linear-to-br from-purple-600 via-[#1DB954] to-cyan-500",
  ];

  // Render current slide content
  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <IntroSlide />;
      case 1:
        return <TotalCommitsSlide stats={stats} />;
      case 2:
        return <TopLanguageSlide stats={stats} />;
      case 3:
        return <CodingPatternSlide stats={stats} />;
      case 4:
        return <FavoriteRepoSlide stats={stats} />;
      case 5:
        return <LinesOfCodeSlide stats={stats} />;
      case 6:
        return <DeveloperProfileSlide stats={stats} />;
      case 7:
        return <SummarySlide stats={stats} />;
      default:
        return <IntroSlide />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${backgrounds[currentSlide]} relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-black/10 rounded-full blur-3xl"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl text-center"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrev={prevSlide}
        onNext={nextSlide}
        onGoTo={goToSlide}
      />
    </div>
  );
}
