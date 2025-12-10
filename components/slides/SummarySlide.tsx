"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";

interface Props {
  stats: GitHubStats;
}

interface StatCardProps {
  label: string;
  value: string | number;
  delay: number;
}

function StatCard({ label, value, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
    >
      <p className="text-3xl md:text-4xl font-black text-white mb-2">{value}</p>
      <p className="text-white/60 text-sm">{label}</p>
    </motion.div>
  );
}

function HighlightChip({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="text-center px-4"
    >
      <p className="font-bold text-2xl text-white">{value}</p>
      <p className="text-white/60 text-sm">{label}</p>
    </motion.div>
  );
}

export default function SummarySlide({ stats }: Props) {
  const currentYear = new Date().getFullYear();
  const languageCount = Object.keys(stats.topLanguages).length;
  const topRepoName = stats.topRepos[0]?.name.split("/")[1] || "Vários projetos";

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      {/* Header */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl text-white/80 font-light uppercase tracking-widest mb-4"
        >
          Seu ano em código
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-black text-white"
        >
          {currentYear} Wrapped
        </motion.h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        <StatCard label="Commits" value={stats.totalCommits.toLocaleString("pt-BR")} delay={0.3} />
        <StatCard label="Repositórios" value={stats.totalRepos} delay={0.4} />
        <StatCard label="Linguagens" value={languageCount} delay={0.5} />
        <StatCard label="Maior Sequência" value={`${stats.longestStreak}d`} delay={0.6} />
      </div>

      {/* Highlights */}
      <div className="flex flex-wrap justify-center gap-8">
        <HighlightChip
          label="Linhas adicionadas"
          value={`+${stats.linesAdded.toLocaleString("pt-BR")}`}
          delay={0.7}
        />
        <HighlightChip
          label="Dias ativos"
          value={stats.totalDaysActive.toString()}
          delay={0.8}
        />
        <HighlightChip
          label="Repo favorito"
          value={topRepoName}
          delay={0.9}
        />
      </div>
    </div>
  );
}
