"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user" makes Motion automatically respect the visitor's
// prefers-reduced-motion setting across every animation in the app.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
