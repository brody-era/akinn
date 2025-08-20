"use client";

import { useState } from "react";

type Step = { id: number; title: string; body: string };

const STEPS: Step[] = [
  {
    id: 1,
    title: "Talent Screening",
    body:
      "Dive into the first step of your career journey with us. Show us your unique skills and experiences that make you stand out. This is your moment to shine and lay the groundwork for an exciting future.",
  },
  {
    id: 2,
    title: "Craft Task",
    body:
      "Unleash your creativity and problem-solving skills with our craft task. Demonstrate how you approach real-world scenarios and bring ideas to life.",
  },
  {
    id: 3,
    title: "Meet your manager",
    body:
      "Have a focused conversation about your experience, the role, and expectations. Ask the questions that matter to you.",
  },
  {
    id: 4,
    title: "Meet the team",
    body:
      "Step into the heart of our company culture. Engage with your potential future colleagues and discover the collaborative spirit that drives our success. Get a feel for the team dynamics and how you can contribute to our shared goals.",
  },
  {
    id: 5,
    title: "Receive your offer",
    body:
      "If it's a match, we'll share an offer that reflects your talent and potential. Welcome aboard.",
  },
];

export default function InterviewProcess() {
  const [active, setActive] = useState<number>(1);
  const current = STEPS.find((s) => s.id === active)!;

  return (
    <div className="flex items-start gap-6 mt-8">
      {/* LEFT RAIL - Steps */}
      <div className="relative flex-shrink-0 w-[240px]">
        <div className="flex flex-col">
          {STEPS.map((s) => {
            const isActive = s.id === active;
            return (
              <div
                key={s.id}
                className="relative"
                onMouseEnter={() => setActive(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActive(s.id);
                  }
                }}
              >
                {/* Active state background */}
                {isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(270deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 70%)",
                    }}
                  />
                )}

                {/* Step content */}
                <div
                  className={`
                    group relative flex items-center gap-3 px-0 py-2.5 cursor-pointer transition-colors duration-200
                    ${isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"}
                  `}
                >
                  {/* Hover shimmer */}
                  <div
                    className="absolute top-0 bottom-0 right-0 w-[40%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(270deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.00) 80%)",
                    }}
                  />

                  {/* Step number */}
                  <span
                    className={`
                      w-5 text-right text-sm font-light relative z-10
                      ${isActive ? "text-white" : "text-neutral-600"}
                    `}
                  >
                    {s.id}.
                  </span>
                  
                  {/* Step title */}
                  <span
                    className={`
                      text-sm font-light relative z-10 leading-relaxed
                      ${isActive ? "text-white" : "text-neutral-500"}
                    `}
                  >
                    {s.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div className="absolute top-0 right-0 h-full w-px bg-neutral-700/30" />
      </div>

      {/* RIGHT CONTENT - Description */}
      <div className="flex-1 pl-6">
        <p className="text-white text-sm font-light leading-relaxed max-w-[400px]">
          {current.body}
        </p>
      </div>
    </div>
  );
}