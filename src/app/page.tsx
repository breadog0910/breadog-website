"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Orb from "@/components/Orb";
import type { Profile } from "@/lib/types";

const DEFAULT_SUBTITLE = "软件工程学生 · 技术探索者 · 创造者";
const DEFAULT_DESCRIPTION = "记录学习之路，分享技术思考，展示创造之物";

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);

  useEffect(() => {
    setMounted(true);
    // 从 API 读取 profile 文案
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data: { data?: Profile }) => {
        if (data.data?.splash_subtitle) setSubtitle(data.data.splash_subtitle);
        if (data.data?.splash_description)
          setDescription(data.data.splash_description);
      })
      .catch(() => {
        // 使用默认文案
      });
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Orb 作为全屏背景 */}
      <div className="absolute inset-0">
        <Orb
          hue={260}
          hoverIntensity={0.8}
          rotateOnHover={true}
          forceHoverState={false}
          backgroundColor="#0a0a0a"
        />
      </div>

      {/* 文字覆盖层（pointer-events-none 让鼠标事件穿透到 Orb） */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 pointer-events-none">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-2xl sm:text-3xl font-medium tracking-wide mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 via-accent/80 to-primary-light/70">
                胡悠茗
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
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
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-white/70 mb-4 max-w-lg mx-auto"
          >
            {subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-sm text-white/40 mb-12 max-w-md mx-auto"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.button
              onClick={() => router.push("/home")}
              className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full text-lg font-medium
                         bg-white/10 backdrop-blur-sm border border-white/20 text-white cursor-pointer
                         hover:bg-white/20 hover:border-white/30 transition-all duration-300 pointer-events-auto"
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
    </div>
  );
}
