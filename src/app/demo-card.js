import Image from "next/image";
import MotionLink from "@/components/motion-link";

function PlaceholderArt() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 via-accent/5 to-transparent">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent/60"
      >
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="m3 15 4-4 4 4 6-6 4 4" />
      </svg>
    </div>
  );
}

export default function DemoCard({ title, description, imageSrc, demoUrl }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-glass-border bg-glass shadow-sm backdrop-blur-xl backdrop-saturate-150">
      <div className="relative aspect-video w-full overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${title} demo screenshot`}
            fill
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt />
        )}

        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4">
          {demoUrl ? (
            <MotionLink
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View Live Demo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </MotionLink>
          ) : (
            <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-600">
              Demo link coming soon
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
