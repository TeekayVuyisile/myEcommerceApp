import Image from "next/image";
import Link from "next/link";
import PricingCard from "./pricing-card";
import DemoCard from "./demo-card";
import HeroVisual from "./hero-visual";
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
    body: "Be found on Google and social media by people who don't know you yet — not just the customers who already do.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2c2.5 2.8 4 6.4 4 10s-1.5 7.2-4 10c-2.5-2.8-4-6.4-4-10s1.5-7.2 4-10Z" />
      </>
    ),
  },
  {
    title: "Look established & trustworthy",
    body: "A real website makes a business look serious and permanent — not just another WhatsApp number or Facebook page.",
    icon: (
      <>
        <path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Sell around the clock",
    body: "Customers can browse, place orders, or get in touch any time — even while you're asleep or busy with another job.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    title: "Stand out from competitors",
    body: "Most small businesses in your area still don't have a proper website — having one is an easy way to look more credible than the competition.",
    icon: (
      <>
        <path d="M3 17 9 11 13 15 21 7" />
        <path d="M15 7h6v6" />
      </>
    ),
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
    title: "I build, you preview",
    body: "I build your site and send you a private link with a live, working preview.",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    title: "Pay when happy",
    body: "Only once you approve the result do you pay, securely, through the same link.",
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
    <div className="flex flex-1 flex-col bg-background text-foreground">
      {/*
        Full-bleed color wash the glass cards blur against. The cards' own
        backdrop-blur does the blurring — this layer just needs to guarantee
        vivid color everywhere in the viewport, with no gaps, at any scroll
        position (hence `fixed`, not scrolling with content).
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 12% 15%, color-mix(in srgb, var(--accent) 38%, transparent), transparent 70%)," +
            "radial-gradient(ellipse 70% 60% at 88% 85%, color-mix(in srgb, var(--accent) 38%, transparent), transparent 70%)," +
            "radial-gradient(ellipse 65% 55% at 90% 15%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 70%)," +
            "radial-gradient(ellipse 65% 55% at 10% 85%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 70%)," +
            "radial-gradient(ellipse 80% 70% at 50% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 75%)",
        }}
      />

      <header className="sticky top-0 z-10 border-b border-glass-border bg-glass backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight">
            Teekay Web Studio
          </span>
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
                Tell me what you need on WhatsApp. I&apos;ll build it and show
                you a live preview first.
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
                  What makes me different: you never pay upfront. I build
                  first, you review a live preview, and you only pay once
                  you&apos;re genuinely happy with the result.
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
                Pay only when you&apos;re happy
              </span>
            </div>
          </Reveal>
        </div>

        <section className="relative mt-24 w-full">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why your business needs a website
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A few of the ways a proper website pays for itself.
            </p>
          </Reveal>
          <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 0.1}>
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
                      {benefit.icon}
                    </svg>
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

       

        <section className="mt-24 w-full">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              See my work
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A quick look at the kind of sites and stores I build.
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

        <section className="relative mt-24 w-full">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Services &amp; pricing
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick what fits — every plan follows the same rule: you pay once you&apos;re happy.
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

        <section className="relative mt-24 w-full">
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
        <section className="relative mt-24 w-full">
        
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              More about the developer
            </h2>
         </section>
         <Reveal className="relative mt-6 flex w-full max-w-2xl flex-col items-center gap-5 rounded-2xl border border-glass-border bg-glass p-6 text-center shadow-sm backdrop-blur-xl backdrop-saturate-150 sm:flex-row sm:items-start sm:text-left">
          <Image
            src="/profile.jpg"
            alt="Teekay Vuyisile Manale"
            width={80}
            height={80}
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">Hi, I&apos;m Teekay</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Full-stack web developer with a qualification in Information and
              Communication Technology (Sol Plaatje University) and hands-on
              experience building production web apps. I work across React, Next.js, Node.js, PostgreSQL
              and Supabase, and build every project the same way: you see it
              working before you pay for it.
            </p>
            
          </div>
        </Reveal>
        
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
