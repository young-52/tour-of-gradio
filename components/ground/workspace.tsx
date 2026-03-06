"use client";

import CodePane from "@/components/ground/code-pane";
import VizPane from "@/components/ground/viz-pane";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface WorkspaceProps {
  isFull?: boolean;
}

export default function Workspace({ isFull }: WorkspaceProps) {
  return (
    <div className={`flex flex-1 flex-col min-h-0 ${isFull && "h-full"}`}>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={30}>
          <CodePane />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <VizPane />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
