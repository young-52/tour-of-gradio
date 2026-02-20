"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PostNavigation({
  slug,
  subDir,
  className,
  order,
  listHref,
}: {
  slug: string;
  subDir: string;
  className?: string;
  order: string[];
  listHref?: string;
}) {
  const currentIndex = order.indexOf(slug);
  const prevPostIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextPostIndex =
    currentIndex < order.length - 1 ? currentIndex + 1 : null;

  const prevPostId = prevPostIndex !== null ? order[prevPostIndex] : null;
  const nextPostId = nextPostIndex !== null ? order[nextPostIndex] : null;

  return (
    <div className={clsx("flex gap-2 justify-between pt-21", className)}>
      {prevPostId ? (
        <Button asChild variant="ghost">
          <Link href={`/${subDir}/${prevPostId}`}>
            <ChevronLeft size={16} />
            <span>이전글</span>
          </Link>
        </Button>
      ) : (
        <Button variant="ghost" className="text-transparent" disabled>
          <ChevronLeft size={16} />
          <span>이전글</span>
        </Button>
      )}

      <Button asChild variant="ghost">
        <Link href={listHref || `/${subDir}`}>
          <List size={16} />
          목록으로
        </Link>
      </Button>

      {nextPostId ? (
        <Button asChild variant="default">
          <Link href={`/${subDir}/${nextPostId}`}>
            <span>다음글</span>
            <ChevronRight size={16} />
          </Link>
        </Button>
      ) : (
        <Button variant="ghost" className="text-transparent" disabled>
          <span>다음글</span>
          <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
}
