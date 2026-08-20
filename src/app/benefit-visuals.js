// Small looping CSS/SVG animations for the benefit cards — same "no 3D
// engine" approach as globe-visual.js, sized to drop into the existing
// h-14 w-14 icon slot. Keyframes live in globals.css.

export function TrustBadge() {
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 text-accent" aria-hidden>
      <circle cx="28" cy="28" r="21" className="trust-glow" fill="currentColor" />
      <path
        d="M28 8 L44 14 V27 C44 37 37 44 28 48 C19 44 12 37 12 27 V14 Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19 27 L25 34 L38 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="trust-check"
      />
    </svg>
  );
}

export function ClockVisual() {
  return (
    <div className="clock-face relative h-14 w-14 rounded-full border-2 border-accent/30 text-accent">
      <span className="clock-hand clock-hand--hour" />
      <span className="clock-hand clock-hand--minute" />
      <span className="clock-orbit">
        <span className="clock-orbit-dot" />
      </span>
    </div>
  );
}

export function StandoutVisual() {
  return (
    <div className="flex h-14 w-14 items-end justify-center gap-1.5 rounded-2xl bg-accent/10 px-2 pb-2 pt-3">
      <span className="standout-bar w-1.5 rounded-full bg-accent/30" style={{ height: "40%" }} />
      <span className="standout-bar w-1.5 rounded-full bg-accent/30" style={{ height: "60%" }} />
      <span
        className="standout-bar standout-bar--accent w-1.5 rounded-full bg-accent"
        style={{ height: "85%" }}
      />
      <span className="standout-bar w-1.5 rounded-full bg-accent/30" style={{ height: "50%" }} />
    </div>
  );
}
