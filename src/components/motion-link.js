"use client";

import { motion } from "motion/react";

// Anchor with a tactile press/hover feel, used for the main CTA buttons.
export default function MotionLink({ children, className, ...props }) {
  return (
    <motion.a
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}
