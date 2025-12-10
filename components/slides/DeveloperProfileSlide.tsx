"use client";

import { motion } from "framer-motion";
import { GitHubStats } from "@/types/github";

interface Props {
  stats: GitHubStats;
}

const PROFILE_CONFIG: Record<string, { title: string; description: string }> = {
  "Weekend Warrior": {
    title: "Guerreiro de Fim de Semana",
    description: "Transforma sábados e domingos em sprints épicos",
  },
  "Commit Machine": {
    title: "Máquina de Commits",
    description: "Produtividade que não para, código que não espera",
  },
  "Language Explorer": {
    title: "Explorador de Linguagens",
    description: "Cada projeto é uma aventura em uma nova syntax",
  },
  "Feature Factory": {
    title: "Fábrica de Features",
    description: "Onde ideias viram funcionalidades em tempo recorde",
  },
  "Refactor Addict": {
    title: "Viciado em Refatoração",
    description: "Código bom pode sempre ficar melhor",
  },
  "Bug Squasher": {
    title: "Caçador de Bugs",
    description: "Nenhum bug escapa do seu radar",
  },
  "Code Poet": {
    title: "Poeta do Código",
    description: "Cada função é uma estrofe, cada classe uma obra",
  },
  "Open Source Hero": {
    title: "Herói Open Source",
    description: "Contribuindo para um mundo de código aberto",
  },
};

export default function DeveloperProfileSlide({ stats }: Props) {
  const config = PROFILE_CONFIG[stats.developerProfile] ?? PROFILE_CONFIG["Open Source Hero"];
  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Header */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl text-white/80 font-light uppercase tracking-widest mb-4"
        >
          Seu perfil de desenvolvedor
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-white mb-2"
        >
          {config.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-lg"
        >
          {config.description}
        </motion.p>
      </div>

      {/* Achievements */}
      {unlockedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-2xl mt-4"
        >
          <p className="text-white/60 text-center text-sm uppercase tracking-widest mb-6">
            Conquistas Desbloqueadas
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {unlockedAchievements.slice(0, 6).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3"
              >
                <p className="text-white font-semibold">{achievement.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-6"
      >
        <div className="text-center">
          <p className="text-3xl font-black text-white">{stats.totalCommits}</p>
          <p className="text-white/60 text-xs">commits</p>
        </div>
        <div className="w-px bg-white/20" />
        <div className="text-center">
          <p className="text-3xl font-black text-white">{stats.totalRepos}</p>
          <p className="text-white/60 text-xs">repos</p>
        </div>
        <div className="w-px bg-white/20" />
        <div className="text-center">
          <p className="text-3xl font-black text-white">{stats.totalDaysActive}</p>
          <p className="text-white/60 text-xs">dias ativos</p>
        </div>
      </motion.div>
    </div>
  );
}
