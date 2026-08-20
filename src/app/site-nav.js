"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Header offset accounts for the sticky header height plus the same
// breathing room the sections' own scroll-mt-24 gives — kept in sync with
// that Tailwind value (24 * 4 = 96px) rather than relying on it alone,
// since we're bypassing native anchor scrolling entirely below.
const SCROLL_OFFSET = 96;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function smoothScrollToHash(hash) {
  const target = document.querySelector(hash);
  if (!target) return;

  // The mobile menu's scroll-lock cleanup normally runs via its effect's
  // own cleanup, but that fires asynchronously — too late to matter here,
  // since this animation starts immediately and would otherwise run its
  // whole course while the body is still overflow:hidden, ending with the
  // page not actually having moved.
  document.body.style.overflow = "";

  history.pushState(null, "", hash);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.scrollIntoView();
    return;
  }

  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + startY - SCROLL_OFFSET;
  const distance = targetY - startY;
  const duration = 600;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function HamburgerIcon({ open }) {
  return (
    <span className="relative flex h-3.5 w-4 flex-col justify-between">
      <span
        className={`h-0.5 w-full rounded-full bg-current transition-transform duration-300 ${
          open ? "translate-y-[6px] rotate-45" : ""
        }`}
      />
      <span
        className={`h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`h-0.5 w-full rounded-full bg-current transition-transform duration-300 ${
          open ? "-translate-y-[6px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export default function SiteNav({ links, ctaHref }) {
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  function handleLinkClick(e, href) {
    e.preventDefault();
    setOpen(false);
    smoothScrollToHash(href);
  }

  return (
    <>
      <nav
        onMouseLeave={() => setHovered(null)}
        className="hidden items-center gap-1 rounded-full border border-glass-border bg-glass/70 p-1 text-sm text-muted-foreground lg:flex"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href)}
            onMouseEnter={() => setHovered(link.href)}
            onFocus={() => setHovered(link.href)}
            className="relative cursor-pointer rounded-full px-3.5 py-1.5 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
          >
            <AnimatePresence>
              {hovered === link.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-accent/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 420, damping: 32 },
                    opacity: { duration: 0.15 },
                  }}
                />
              )}
            </AnimatePresence>
            <span className="relative">{link.label}</span>
          </a>
        ))}
      </nav>

      <div ref={containerRef} className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-glass-border text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <HamburgerIcon open={open} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-20 border-b border-glass-border bg-glass p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150"
            >
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              {ctaHref && (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex cursor-pointer items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Chat on WhatsApp
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
