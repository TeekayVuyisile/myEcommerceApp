// Pure CSS/SVG sphere — the "rotation" illusion comes from meridian rings
// cycling scaleX while the shading stays fixed, so it reads as a turning
// globe without pulling in a WebGL/3D library. Pins are rough illustrative
// positions, not real geo-coordinates.
const PINS = [
  { x: 26, y: 34 },
  { x: 58, y: 22 },
  { x: 76, y: 46 },
  { x: 44, y: 72 },
  { x: 18, y: 58 },
];

const LINKS = [
  [0, 2],
  [1, 3],
  [4, 1],
];

export default function GlobeVisual({ className = "" }) {
  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <div className="globe-sphere absolute inset-0 rounded-full">
        <span className="globe-meridian" style={{ animationDelay: "0s" }} />
        <span className="globe-meridian" style={{ animationDelay: "-2.2s" }} />
        <span className="globe-meridian" style={{ animationDelay: "-4.4s" }} />
        <span className="globe-latitude-top" />
        <span className="globe-equator" />
        <span className="globe-latitude-bottom" />
      </div>

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        {LINKS.map(([a, b], i) => {
          const pa = PINS[a];
          const pb = PINS[b];
          const mx = (pa.x + pb.x) / 2;
          const my = Math.min(pa.y, pb.y) - 16;
          return (
            <path
              key={`${a}-${b}`}
              d={`M ${pa.x} ${pa.y} Q ${mx} ${my} ${pb.x} ${pb.y}`}
              className="globe-link"
              style={{ animationDelay: `${i * 0.9}s` }}
            />
          );
        })}
        {PINS.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <circle
              r="4"
              className="globe-pin-ping"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
            <circle r="1.6" className="globe-pin-dot" />
          </g>
        ))}
      </svg>
    </div>
  );
}
