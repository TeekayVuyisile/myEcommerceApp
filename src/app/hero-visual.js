// A stylized "browser preview" mockup — stands in for a screenshot, and
// visually reinforces the "you see a live preview before you pay" pitch.
export default function HeroVisual() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-card-border bg-card p-2 shadow-xl">
      <div className="overflow-hidden rounded-[1.5rem] border border-card-border bg-background">
        <div className="flex items-center gap-1.5 border-b border-card-border bg-card px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-3 flex-1 truncate rounded-full border border-card-border bg-background px-3 py-1 text-[10px] text-muted-foreground">
            yourbusiness.co.za
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <div className="h-2 w-14 rounded bg-foreground/20" />
            <div className="flex gap-2">
              <div className="h-2 w-6 rounded bg-foreground/10" />
              <div className="h-2 w-6 rounded bg-foreground/10" />
              <div className="h-2 w-6 rounded bg-foreground/10" />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-accent/5 p-4">
            <div className="h-3 w-3/4 rounded bg-foreground/25" />
            <div className="h-2 w-1/2 rounded bg-foreground/15" />
            <div className="mt-2 h-6 w-24 rounded-full bg-accent" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 rounded-lg border border-card-border p-2"
              >
                <div className="h-8 w-full rounded bg-accent/15" />
                <div className="h-1.5 w-3/4 rounded bg-foreground/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
