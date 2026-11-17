// A stylized "browser preview" mockup — stands in for a screenshot, and
// visually reinforces the "you see a live preview before you pay" pitch.
// The wireframe bars shimmer like a loading skeleton (staggered, left to
// right / top to bottom) so the card reads as "actively being built".
export default function HeroVisual() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-card-border bg-card p-2 shadow-xl">
      <div className="overflow-hidden rounded-[1.5rem] border border-card-border bg-background">
        <div className="flex items-center gap-1.5 border-b border-card-border bg-card px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="hero-mock-live-dot h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-3 flex-1 truncate rounded-full border border-card-border bg-background px-3 py-1 text-[10px] text-muted-foreground">
            yourbusiness.co.za
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <div
              className="skeleton h-2 w-14 rounded bg-foreground/20"
              style={{ "--shimmer-delay": "0s" }}
            />
            <div className="flex gap-2">
              <div
                className="skeleton h-2 w-6 rounded bg-foreground/10"
                style={{ "--shimmer-delay": "0.1s" }}
              />
              <div
                className="skeleton h-2 w-6 rounded bg-foreground/10"
                style={{ "--shimmer-delay": "0.15s" }}
              />
              <div
                className="skeleton h-2 w-6 rounded bg-foreground/10"
                style={{ "--shimmer-delay": "0.2s" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-accent/5 p-4">
            <div
              className="skeleton h-3 w-3/4 rounded bg-foreground/25"
              style={{ "--shimmer-delay": "0.3s" }}
            />
            <div
              className="skeleton h-2 w-1/2 rounded bg-foreground/15"
              style={{ "--shimmer-delay": "0.4s" }}
            />
            <div
              className="skeleton mt-2 h-6 w-24 rounded-full bg-accent"
              style={{ "--shimmer-delay": "0.5s" }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 rounded-lg border border-card-border p-2"
              >
                <div
                  className="skeleton h-8 w-full rounded bg-accent/15"
                  style={{ "--shimmer-delay": `${0.6 + i * 0.1}s` }}
                />
                <div
                  className="skeleton h-1.5 w-3/4 rounded bg-foreground/15"
                  style={{ "--shimmer-delay": `${0.65 + i * 0.1}s` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
