"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";

interface Props {
  stats: GitHubStats;
}

export default function TotalCommitsSlide({ stats }: Props) {
  return (
    <div className="space-y-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl md:text-3xl text-white/80 font-light uppercase tracking-widest"
      >
        Você fez
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="text-9xl md:text-[14rem] font-black text-white leading-none"
      >
        {stats.totalCommits.toLocaleString("pt-BR")}
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl md:text-5xl text-white font-light"
      >
        commits
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl md:text-2xl text-white/70 mt-12"
      >
        em {stats.totalRepos} repositórios
      </motion.p>
    </div>
  );
}
