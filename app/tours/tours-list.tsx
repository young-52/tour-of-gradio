"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import type { Frontmatter } from "@/lib/process-post";

interface ToursListProps {
  data: Array<readonly [string, Frontmatter]>;
}

export function ToursList({ data }: ToursListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ul
      className="flex flex-col gap-1"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {data.map(([fileName, frontmatter], index) => {
        const isHovered = hoveredIndex === index;

        return (
          <li key={frontmatter.id} className="flex flex-col">
            {fileName === "what-is-llm" && (
              <h2 className="mt-4 mb-4 text-muted-foreground font-medium pointer-events-none">
                파트 1 — LLM이 뭐예요?
              </h2>
            )}
            {fileName === "what-is-prompting" && (
              <h2 className="mt-12 mb-4 text-muted-foreground font-medium pointer-events-none">
                파트 2 — Prompting이 뭐예요?
              </h2>
            )}
            {fileName === "what-is-gradio" && (
              <h2 className="mt-12 mb-4 text-muted-foreground font-medium pointer-events-none">
                파트 3 — Gradio가 뭐예요?
              </h2>
            )}
            <Link
              href={`/tours/${fileName}`}
              className="relative p-0.5 block group"
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    layoutId="hover-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-muted/60 rounded-xl -z-10"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.3,
                    }}
                  />
                )}
              </AnimatePresence>
              <div className="flex items-center gap-6 px-4 py-2.5">
                <span className="text-xl font-base text-muted-foreground shrink-0 tabular-nums">
                  #{frontmatter.id}
                </span>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-lg font-semibold group-hover:underline decoration-muted-foreground/30 underline-offset-4 truncate">
                    {frontmatter.icon} {frontmatter.title}
                  </h3>
                  <p className="text-sm text-muted-foreground break-keep">
                    {frontmatter.description}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
