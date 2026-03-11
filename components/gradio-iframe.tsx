"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface GradioIframeProps {
  src: string;
  title?: string;
  initialHeight?: number;
}

export default function GradioIframe({
  src,
  title = "Gradio App",
  initialHeight = 500,
}: GradioIframeProps) {
  const [height, setHeight] = useState(initialHeight);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (typeof data === "object" && data !== null) {
        if (
          (data.type === "resize" || data.msg === "resize") &&
          typeof data.height === "number"
        ) {
          setHeight(data.height + 20); // Add a little buffer
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Sync theme with the iframe if it's a Gradio app that supports __theme param
  const themeSrc = src.includes("?")
    ? `${src}&__theme=${resolvedTheme}`
    : `${src}?__theme=${resolvedTheme}`;

  return (
    <div className="w-full overflow-hidden rounded-md border border-border">
      <iframe
        ref={iframeRef}
        src={themeSrc}
        title={title}
        width="100%"
        height={height}
        className="w-full border-0"
      ></iframe>
    </div>
  );
}
