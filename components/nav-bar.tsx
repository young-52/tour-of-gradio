"use client";

import { Gradio } from "@lobehub/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto mx-auto w-full max-w-3xl flex justify-between items-center gap-2 px-6 py-2 rounded-full transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl shadow-lg border-border"
            : "bg-background/50 backdrop-blur-md shadow-none border-border/40",
        )}
      >
        <Link
          href="/"
          className="text-lg sm:text-lg lg:text-xl font-bold font-title flex items-center transition-opacity hover:opacity-80"
        >
          <Gradio.Color size={32} />
        </Link>

        <div className="flex gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="flex items-center gap-1">
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent h-9 px-4 relative overflow-hidden transition-all rounded-2xl",
                    "bg-gradient-to-r from-primary to-primary bg-[length:0%_100%] bg-no-repeat bg-left hover:bg-[length:100%_100%] hover:text-primary-foreground transition-[background-size] duration-500 ease-out hover:bg-transparent",
                  )}
                >
                  <Link href="/tours">배우기</Link>
                </NavigationMenuLink>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent h-9 px-4 relative overflow-hidden transition-all rounded-2xl",
                    "bg-gradient-to-r from-primary to-primary bg-[length:0%_100%] bg-no-repeat bg-left hover:bg-[length:100%_100%] hover:text-primary-foreground transition-[background-size] duration-500 ease-out hover:bg-transparent",
                  )}
                >
                  <Link href="/archives">아카이브</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    </header>
  );
}
