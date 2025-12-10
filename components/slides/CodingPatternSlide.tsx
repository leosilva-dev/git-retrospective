"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";

interface Props {
  stats: GitHubStats;
}

interface TimePeriod {
  key: string;
  label: string;
  hours: string;
  commits: number;
}

const PATTERN_CONFIG: Record<string, { label: string; description: string }> = {
  "Night Owl": {
    label: "Coruja Noturna",
    description: "Seus commits preferidos são de madrugada",
  },
  "Early Bird": {
    label: "Madrugador",
    description: "Você começa a codar cedo",
  },
  "Afternoon Coder": {
    label: "Desenvolvedor da Tarde",
    description: "Seu pico de produtividade é à tarde",
  },
  "All Day Coder": {
    label: "Desenvolvedor Full-Time",
    description: "Você programa em qualquer horário",
  },
};

function calculateTimePeriods(commitsByHour: number[]): TimePeriod[] {
  const nightCommits = commitsByHour.slice(22).concat(commitsByHour.slice(0, 6)).reduce((a, b) => a + b, 0);
  const morningCommits = commitsByHour.slice(6, 12).reduce((a, b) => a + b, 0);
  const afternoonCommits = commitsByHour.slice(12, 18).reduce((a, b) => a + b, 0);
  const eveningCommits = commitsByHour.slice(18, 22).reduce((a, b) => a + b, 0);

  return [
    { key: "morning", label: "Manhã", hours: "6h - 12h", commits: morningCommits },
    { key: "afternoon", label: "Tarde", hours: "12h - 18h", commits: afternoonCommits },
    { key: "evening", label: "Noite", hours: "18h - 22h", commits: eveningCommits },
    { key: "night", label: "Madrugada", hours: "22h - 6h", commits: nightCommits },
  ];
}

function PeriodBar({ period, maxCommits, delay }: { period: TimePeriod; maxCommits: number; delay: number }) {
  const percentage = maxCommits > 0 ? (period.commits / maxCommits) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-2 "
    >
      <div className="w-24 text-right">
        <p className="text-white/90 text-sm font-medium">{period.label}</p>
        <p className="text-white/50 text-xs">{period.hours}</p>
      </div>
      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full bg-white/80 rounded-full"
        />
      </div>
      <span className="text-white font-bold text-sm min-w-8 mr-8">{period.commits}</span>
    </motion.div>
  );
}

export default function CodingPatternSlide({ stats }: Props) {
  const config = PATTERN_CONFIG[stats.codingPattern] ?? PATTERN_CONFIG["All Day Coder"];
  const periods = calculateTimePeriods(stats.commitsByHour);
  const maxCommits = Math.max(...periods.map(p => p.commits));

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Header */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl text-white/80 font-light uppercase tracking-widest mb-4"
        >
          Seu estilo de código
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-4xl md:text-5xl font-black text-white"
        >
          {config.label}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/70 text-lg mt-2"
        >
          {config.description}
        </motion.p>
      </div>

      {/* Time Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-3xl p-6"
      >
        <p className="text-white/80 text-center mb-6 font-medium">
          Distribuição dos seus commits
        </p>
        <div className="space-y-4">
          {periods.map((period, index) => (
            <PeriodBar
              key={period.key}
              period={period}
              maxCommits={maxCommits}
              delay={0.5 + index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex gap-8"
      >
        <div className="text-center">
          <p className="text-4xl font-black text-white">{stats.longestStreak}</p>
          <p className="text-white/70 text-sm">dias de sequência</p>
        </div>
        <div className="w-px bg-white/20" />
        <div className="text-center">
          <p className="text-4xl font-black text-white">{stats.totalDaysActive}</p>
          <p className="text-white/70 text-sm">dias ativos</p>
        </div>
      </motion.div>
    </div>
  );
}
