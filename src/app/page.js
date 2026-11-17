import Image from "next/image";
import Link from "next/link";
import PricingCard from "./pricing-card";
import DemoCard from "./demo-card";
import HeroVisual from "./hero-visual";
import GlobeVisual from "./globe-visual";
import SiteNav from "./site-nav";
import { TrustBadge, ClockVisual, StandoutVisual } from "./benefit-visuals";
import ThemeToggle from "@/components/theme-toggle";
import ChatWidget from "@/components/chat-widget";
import Reveal from "@/components/reveal";
import MotionLink from "@/components/motion-link";
import { getResolvedServices } from "@/lib/pricing";

// Pricing (including scheduled sale start/end times) has to actually take
// effect without a redeploy. Saving a price in the admin already triggers an
// immediate revalidatePath("/"), but a scheduled sale's start/end time isn't
// tied to any admin action — this periodic revalidation is what makes those
// boundaries take effect on their own.
export const revalidate = 60;

const WHATSAPP_NUMBER = "27798518109";

function whatsappHref(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const NAV_LINKS = [
  { href: "#benefits", label: "Why a website" },
  { href: "#work", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
];

const DEMOS = [
  {
    title: "Website",
    description: "A custom-built, responsive business website with good design and user experience.",
    imageSrc: "/Website_image.png",
    demoUrl: "https://kotas-web-ui-ux.vercel.app/",
  },
  {
    title: "E-commerce Web App",
    description: "A full online store demo showcasing product listings, cart, and checkout.",
    imageSrc: "/Ecommerce_website_image.png",
    demoUrl: "https://thread-ecommerce-ui-ux.vercel.app/",
  },
];

const BENEFITS = [
  {
    title: "Reach more customers",
  },
  {
    title: "Look established & trustworthy",
    body: "A real website makes a business look serious and permanent — not just another WhatsApp number or Facebook page.",
    Visual: TrustBadge,
  },
  {
    title: "Sell around the clock",
    body: "Customers can browse, place orders, or get in touch any time — even while you're asleep or busy with another job.",
    Visual: ClockVisual,
  },
  {
    title: "Stand out from competitors",
    body: "Most small businesses in your area still don't have a proper website — having one is an easy way to look more credible than the competition.",
    Visual: StandoutVisual,
  },
];

const STEPS = [
  {
    title: "Message me",
    body: "Chat with me on WhatsApp about what you need — no forms, no commitment.",
    icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    ),
  },
  {
    title: "Deposit, build & preview",
    body: "Pay a 30% deposit (card or EFT) through your private order link. I build your site and share a live, working preview with unlimited revisions.",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    title: "Approve & pay the balance",
    body: "A 30% deposit starts the build. Once you approve the preview, you pay the rest — by card or EFT.",
    icon: (
      <>
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20M6 15h4" />
      </>
    ),
  },
];

export default async function Home() {
  const services = await getResolvedServices();

  return (
    <div className="relative isolate flex flex-1 flex-col bg-background text-foreground">
      {/*
        Hero-only gradient slash — like Stripe's hero banner, but confined to
        just the header + hero band (not the whole page) and recolored to
        our own accent (indigo/blue) family instead of their purple-to-red
        spectrum. Blobs sit only in the top-left quadrant and the mask cuts
        off well past halfway across, so the right/bottom of the hero (and
        every section below it) stays plain background — no page-wide tint.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden sm:h-[600px] lg:h-[620px]"
      >
        <div
          className="hero-gradient-drift absolute -inset-[10%]"
          style={{
            background:
              "radial-gradient(ellipse 48% 42% at 8% 12%, color-mix(in srgb, var(--accent) 75%, transparent), transparent 70%)," +
              "radial-gradient(ellipse 42% 38% at 32% 4%, color-mix(in srgb, #38bdf8 60%, transparent), transparent 70%)," +
              "radial-gradient(ellipse 50% 45% at 18% 40%, color-mix(in srgb, #312e81 55%, transparent), transparent 68%)",
            maskImage:
              "linear-gradient(115deg, white 0%, white 26%, transparent 55%)",
            WebkitMaskImage:
              "linear-gradient(115deg, white 0%, white 26%, transparent 55%)",
          }}
        />
      </div>

      <header className="sticky top-0 z-10 border-b border-glass-border bg-glass backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-accent">
              <Image
                src="/logo.png"
                alt="Teekay Web Studio logo"
                width={80}
                height={80}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Teekay Web Studio
            </span>
          </div>
          <SiteNav
            links={NAV_LINKS}
            ctaHref={whatsappHref(
              "Hi! I'd like to talk about building a website/e-commerce store."
            )}
          />
          <div className="flex items-center gap-3">
            <MotionLink
              href={whatsappHref(
                "Hi! I'd like to talk about building a website/e-commerce store."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden cursor-pointer rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
            >
              Chat on WhatsApp
            </MotionLink>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-20">
        <div className="relative grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Reveal immediate delay={0}>
              <span className="rounded-full border border-card-border px-4 py-1 text-xs font-medium text-muted-foreground">
                Available for new projects
              </span>
            </Reveal>

            <Reveal immediate delay={0.1}>
              <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Custom websites &amp; online stores, built for you
              </h1>
            </Reveal>
            <Reveal immediate delay={0.2}>
              <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                Tell me what you need on WhatsApp. A 30% deposit starts the
                build, and you see a live preview before paying the balance.
              </p>
            </Reveal>

            <Reveal immediate delay={0.3}>
              <div className="mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-accent/30 bg-glass px-5 py-4 text-left backdrop-blur-xl backdrop-saturate-150">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-accent"
                >
                  <path d="M12 22c5.5-1.5 8-6 8-11V5l-8-3-8 3v6c0 5 2.5 9.5 8 11Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <p className="text-sm font-medium">
                  What makes me different: only a 30% deposit to start. You
                  review a live preview, request as many changes as you need,
                  and only pay the balance once you&apos;re genuinely happy.
                </p>
              </div>
            </Reveal>

            <Reveal immediate delay={0.4}>
              <MotionLink
                href={whatsappHref(
                  "Hi! I'd like to talk about building a website/e-commerce store."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Chat on WhatsApp
              </MotionLink>
            </Reveal>
          </div>

          <Reveal immediate delay={0.25} y={24} className="relative mx-auto w-full max-w-xs lg:mx-0 lg:max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent/30 via-accent/10 to-transparent blur-2xl"
            />
            <HeroVisual />
            <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-xl border border-glass-border bg-glass px-4 py-3 shadow-lg backdrop-blur-xl backdrop-saturate-150 sm:flex">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-accent"
              >
                <path d="M12 22c5.5-1.5 8-6 8-11V5l-8-3-8 3v6c0 5 2.5 9.5 8 11Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-xs font-medium">
                Balance only when you&apos;re happy
              </span>
            </div>
          </Reveal>
        </div>

        <section id="benefits" className="relative mt-24 w-full scroll-mt-24">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why your business needs a website
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A few of the ways a proper website pays for itself.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="flex flex-col items-center gap-8 rounded-2xl border border-glass-border bg-glass p-6 shadow-sm backdrop-blur-xl backdrop-saturate-150 sm:flex-row sm:gap-10 sm:p-8">
              <div className="w-full max-w-[220px] shrink-0 sm:w-56">
                <GlobeVisual />
              </div>
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {BENEFITS[0].title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Be found on Google and social media by{" "}
                  <span className="font-medium text-accent">
                    people who don&apos;t know you yet
                  </span>{" "}
                  — not just the customers who already do.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {BENEFITS.slice(1).map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 0.1}>
                <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-glass-border bg-glass p-6 shadow-sm backdrop-blur-xl backdrop-saturate-150">
                  <benefit.Visual />
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

       

        <section id="work" className="mt-24 w-full scroll-mt-24">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              See my demo work
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A quick look at the kind of sites and stores I can build.
            </p>
          </Reveal>
          <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            {DEMOS.map((demo, i) => (
              <Reveal key={demo.title} delay={i * 0.1}>
                <DemoCard {...demo} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="pricing" className="relative mt-24 w-full scroll-mt-24">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Services &amp; pricing
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick what fits — every plan starts with a 30% deposit, and the balance is due once you&apos;re happy.
            </p>
          </Reveal>
          <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {services.map(({ key, ...service }, i) => (
              <Reveal key={key} delay={i * 0.1}>
                <PricingCard {...service} whatsappNumber={WHATSAPP_NUMBER} />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By ordering, you agree to the{" "}
            <Link href="/terms" className="cursor-pointer underline hover:text-accent">
              Terms
            </Link>
            ,{" "}
            <Link href="/privacy" className="cursor-pointer underline hover:text-accent">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/refund-policy" className="cursor-pointer underline hover:text-accent">
              Refund Policy
            </Link>
            .
          </p>
        </section>

        <section id="how-it-works" className="relative mt-24 w-full scroll-mt-24">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              How it works
            </h2>
          </Reveal>
          <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-glass-border bg-glass p-6 shadow-sm backdrop-blur-xl backdrop-saturate-150">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {step.icon}
                    </svg>
                  </div>
                  <h3 className="font-semibold">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="about" className="relative mt-24 w-full scroll-mt-24">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              More about the developer
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The person you&apos;ll actually be chatting with on WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-glass-border bg-glass p-6 shadow-sm backdrop-blur-xl backdrop-saturate-150 sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 -z-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
              />
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <div className="relative">
                    <div
                      aria-hidden
                      className="avatar-glow absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent blur-2xl"
                    />
                    <Image
                      src="/profile.jpg"
                      alt="Teekay Vuyisile Manale"
                      width={160}
                      height={160}
                      className="h-36 w-36 rounded-full border-2 border-accent object-cover sm:h-40 sm:w-40"
                    />
                  </div>
                  <span className="rounded-full border border-card-border px-3 py-1 text-xs text-muted-foreground">
                    South Africa · Remote-friendly
                  </span>
                </div>
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <span className="text-xs font-semibold tracking-widest text-accent">
                    THE DEVELOPER
                  </span>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    Hi, I&apos;m Teekay
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Full-stack web developer with a qualification in
                    Information and Communication Technology (Sol Plaatje
                    University) and hands-on experience building production
                    web apps. I build every project the same way: you see it
                    working before you pay the balance.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {["React", "Next.js", "Node.js", "PostgreSQL", "Supabase"].map(
                      (tech, i) => (
                        <Reveal key={tech} delay={0.3 + i * 0.05}>
                          <span className="inline-block cursor-default rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105">
                            {tech}
                          </span>
                        </Reveal>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="relative mt-24 w-full scroll-mt-24">
          <div className="relative flex w-full flex-col items-center gap-4 overflow-hidden rounded-2xl border border-accent/30 bg-glass px-6 py-12 text-center backdrop-blur-xl backdrop-saturate-150 sm:py-16">
            <div
              aria-hidden
              className="cta-glow pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_70%)]"
            />
            <Reveal>
              <span className="text-xs font-semibold tracking-widest text-accent">
                LET&apos;S BUILD SOMETHING
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to get started?
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell me what you need on WhatsApp — no forms, no commitment,
                just a chat.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <MotionLink
                href={whatsappHref(
                  "Hi! I'd like to talk about building a website/e-commerce store."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.92 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.15.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.15-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.42.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.23.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.17 1.71 2.62 4.14 3.67.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28Z" />
                </svg>
                Chat on WhatsApp
              </MotionLink>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>30% deposit · balance when happy</span>
                <span aria-hidden>·</span>
                <span>Usually replies same day</span>
                <span aria-hidden>·</span>
                <span>Free 5-minute chat</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-glass-border bg-glass backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-8 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <span>© {new Date().getFullYear()} Teekay Web Studio</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/terms" className="cursor-pointer hover:text-accent">
              Terms
            </Link>
            <Link href="/privacy" className="cursor-pointer hover:text-accent">
              Privacy
            </Link>
            <Link
              href="/refund-policy"
              className="cursor-pointer hover:text-accent"
            >
              Refunds
            </Link>
            <MotionLink
              href={whatsappHref("Hi! I'd like to talk about a project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer font-medium text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Chat on WhatsApp
            </MotionLink>
          </div>
        </div>
      </footer>

      <ChatWidget
        whatsappHref={whatsappHref("Hi! I'd like to talk about a project.")}
      />
    </div>
  );
}
