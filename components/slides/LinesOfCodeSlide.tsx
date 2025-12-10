"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";

interface Props {
  stats: GitHubStats;
}

function formatNumber(num: number): string {
  return num.toLocaleString("pt-BR");
}

interface LineStatProps {
  label: string;
  value: number;
  prefix: string;
  color: string;
  delay: number;
  direction: "left" | "right";
}

function LineStat({ label, value, prefix, color, delay, direction }: LineStatProps) {
  const initialX = direction === "left" ? -50 : 50;

  return (
    <motion.div
      initial={{ x: initialX, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 80 }}
      className="text-center"
    >
      <p className="text-white/70 text-lg mb-2">{label}</p>
      <p className={`text-6xl md:text-7xl font-black ${color}`}>
        {prefix}{formatNumber(value)}
      </p>
    </motion.div>
  );
}

export default function LinesOfCodeSlide({ stats }: Props) {
  const totalLines = stats.linesAdded + stats.linesDeleted;
  const netLines = stats.linesAdded - stats.linesDeleted;

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      {/* Header */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl text-white/80 font-light uppercase tracking-widest mb-4"
        >
          Linhas de Código
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-white"
        >
          {formatNumber(totalLines)} linhas modificadas
        </motion.h1>
      </div>

      {/* Lines Added/Removed */}
      <div className="flex items-center gap-12">
        <LineStat
          label="Adicionadas"
          value={stats.linesAdded}
          prefix="+"
          color="text-emerald-300"
          delay={0.4}
          direction="left"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-px h-20 bg-white/30"
        />

        <LineStat
          label="Removidas"
          value={stats.linesDeleted}
          prefix="-"
          color="text-red-300"
          delay={0.6}
          direction="right"
        />
      </div>

      {/* Net result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-4 text-center"
      >
        <p className="text-white/70 text-sm mb-1">Saldo final</p>
        <p className={`text-3xl font-bold ${netLines >= 0 ? "text-emerald-300" : "text-red-300"}`}>
          {netLines >= 0 ? "+" : ""}{formatNumber(netLines)} linhas
        </p>
      </motion.div>
    </div>
  );
}
