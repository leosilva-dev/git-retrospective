"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function Home() {
  const handleSignIn = () => {
    signIn("github", { callbackUrl: "/wrapped" });
  };

  return (
    <main className="min-h-screen bg-[#121212] flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
      <BackgroundBlobs />
      <ContentSection onSignIn={handleSignIn} />
    </main>
  );
}

function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-[#1DB954]/20 via-purple-600/20 to-pink-600/20"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#1DB954]/30 rounded-full blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-purple-500/25 rounded-full blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-[90px]"
        animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function ContentSection({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="text-center max-w-5xl mx-auto relative z-10 w-full">
      <TitleSection />
      <DescriptionSection />
      <ButtonSection onSignIn={onSignIn} />
    </div>
  );
}

function TitleSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="pt-12 sm:pt-16 md:pt-20"
      style={{ marginBottom: "1.5rem" }}
    >
      <motion.h1
        className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black text-white mb-6 sm:mb-8 leading-[0.85] tracking-tighter"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <span className="block bg-clip-text text-transparent bg-linear-to-r from-[#1DB954] via-[#1ED760] to-[#1DB954] drop-shadow-[0_0_80px_rgba(29,185,84,0.5)]">
          Git
        </span>
        <span className="block bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-500 to-purple-400 drop-shadow-[0_0_80px_rgba(168,85,247,0.4)]">
          Wrapped
        </span>
      </motion.h1>
    </motion.div>
  );
}

function DescriptionSection() {
  const descriptions = [
    {
      text: "Seu ano em código",
      className: "text-3xl sm:text-4xl md:text-5xl text-white font-black",
    },
    {
      text: "Descubra seus padrões e conquistas",
      className: "text-xl sm:text-2xl md:text-3xl text-gray-300 font-semibold",
    },
    {
      text: "Uma retrospectiva visual do seu ano no GitHub",
      className: "text-base sm:text-lg md:text-xl text-gray-400 font-normal",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="space-y-4 sm:space-y-5 text-center flex flex-col items-center"
      style={{ marginBottom: "1.5rem" }}
    >
      {descriptions.map((desc, index) => (
        <p
          key={index}
          className={`${desc.className} leading-relaxed max-w-3xl mx-auto text-center`}
        >
          {desc.text}
        </p>
      ))}
    </motion.div>
  );
}

function ButtonSection({ onSignIn }: { onSignIn: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="mb-20 sm:mb-24 md:mb-28"
      style={{ paddingTop: "1.5rem" }}
    >
      <motion.button
        type="button"
        onClick={onSignIn}
        className="relative inline-flex items-center justify-center bg-white text-[#1DB954] font-bold text-lg sm:text-xl md:text-2xl rounded-full transition-all duration-200 focus:outline-none cursor-pointer"
        style={{
          paddingLeft: "4rem",
          paddingRight: "4rem",
          paddingTop: "1.2rem",
          paddingBottom: "1.2rem",
        }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Começar</span>
      </motion.button>
    </motion.div>
  );
}
