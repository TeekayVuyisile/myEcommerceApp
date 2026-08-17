"use client";

import { motion } from "motion/react";

// Fade+slide wrapper. Scroll-triggered by default (`whileInView`); pass
// `immediate` for above-the-fold content that should animate in on load.
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  immediate = false,
  className,
}) {
  const animation = immediate
    ? { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
      };

  return (
    <motion.div
      {...animation}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
