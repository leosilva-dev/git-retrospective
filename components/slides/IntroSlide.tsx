"use client";

import { motion } from "framer-motion";

export default function IntroSlide() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-9xl md:text-[12rem] font-black text-white leading-none mb-8"
      >
        {currentYear}
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-4xl md:text-6xl font-light text-white"
      >
        Seu Ano em Código
      </motion.p>
    </div>
  );
}
