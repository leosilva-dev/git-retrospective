"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";

interface Props {
  stats: GitHubStats;
}

export default function TopLanguageSlide({ stats }: Props) {
  const topLanguages = Object.entries(stats.topLanguages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const totalBytes = topLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);

  if (topLanguages.length === 0) return null;

  const favoriteLanguage = topLanguages[0][0];
  const displayLanguages = topLanguages.slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl md:text-3xl text-white/80 font-light uppercase tracking-widest mb-8"
      >
        Sua linguagem favorita foi
      </motion.p>

      {/* Linguagem principal */}
      <motion.h1
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
        className="text-6xl md:text-9xl font-black text-white leading-none break-words max-w-full"
        style={{ marginBottom: "100px" }}
      >
        {favoriteLanguage}
      </motion.h1>

      {/* Lista de linguagens */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-xl max-w-4xl px-8"
      >
        {displayLanguages.map(([lang, bytes], index) => {
          const percentage = Math.round((bytes / totalBytes) * 100);

          return (
            <motion.div
              key={lang}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between mb-8 gap-8">
                <span className="text-2xl text-white">{lang}</span>
                <span className="text-2xl text-white text-right min-w-16">
                  {percentage}%
                </span>
              </div>

              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
