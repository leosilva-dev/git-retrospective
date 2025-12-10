"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";

interface Props {
  stats: GitHubStats;
}

interface RepoData {
  name: string;
  displayName: string;
  commits: number;
  position: 1 | 2 | 3;
}

const PODIUM_CONFIG = {
  1: { height: "h-32", bg: "bg-yellow-400/20", border: "border-yellow-400/50", medal: "🥇" },
  2: { height: "h-24", bg: "bg-gray-300/20", border: "border-gray-300/50", medal: "🥈" },
  3: { height: "h-20", bg: "bg-amber-600/20", border: "border-amber-600/50", medal: "🥉" },
} as const;

function getDisplayName(fullName: string): string {
  return fullName.includes("/") ? fullName.split("/")[1] : fullName;
}

function PodiumPlace({ repo, delay }: { repo: RepoData; delay: number }) {
  const config = PODIUM_CONFIG[repo.position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center"
    >
      {/* Repo info */}
      <div className="text-center mb-4">
        <p className="text-3xl mb-2">{config.medal}</p>
        <p className="text-white font-bold text-lg truncate max-w-32">
          {repo.displayName}
        </p>
        <p className="text-white/70 text-sm">{repo.commits} commits</p>
      </div>

      {/* Podium bar */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "auto" }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
        className={`w-28 ${config.height} ${config.bg} border-2 ${config.border} rounded-t-xl backdrop-blur-lg flex items-center justify-center`}
      >
        <span className="text-4xl font-black text-white">{repo.position}</span>
      </motion.div>
    </motion.div>
  );
}

export default function FavoriteRepoSlide({ stats }: Props) {
  const repos: RepoData[] = stats.topRepos.slice(0, 3).map((repo, index) => ({
    name: repo.name,
    displayName: getDisplayName(repo.name),
    commits: repo.commits,
    position: (index + 1) as 1 | 2 | 3,
  }));

  const podiumOrder = [repos[1], repos[0], repos[2]].filter(Boolean);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Header */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl text-white/80 font-light uppercase tracking-widest mb-4"
        >
          Seus repositórios mais ativos
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-white"
        >
          Top 3 Repositórios
        </motion.h1>
      </div>

      {/* Podium */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-end justify-center gap-4 mt-8"
      >
        {podiumOrder.map((repo, index) => (
          <PodiumPlace
            key={repo.name}
            repo={repo}
            delay={0.4 + index * 0.15}
          />
        ))}
      </motion.div>

      {/* Base */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="w-96 h-2 bg-white/30 rounded-full -mt-2"
      />
    </div>
  );
}
