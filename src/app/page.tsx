"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* 背景动画渐变 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(-45deg, #6366f1, #06b6d4, #8b5cf6, #3b82f6)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 8s ease infinite",
        }}
      />

      {/* 网格背景 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* 粒子装饰（CSS 模拟） */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-light rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-accent to-purple-400">
              Breadog
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-muted mb-4 max-w-lg mx-auto"
        >
          软件工程学生 · 技术探索者 · 创造者
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-sm text-muted/60 mb-12 max-w-md mx-auto"
        >
          记录学习之路，分享技术思考，展示创造之物
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.button
            onClick={() => router.push("/home")}
            className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full text-lg font-medium
                       bg-white/10 backdrop-blur-sm border border-white/20 text-white
                       hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>进入探索</span>
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
