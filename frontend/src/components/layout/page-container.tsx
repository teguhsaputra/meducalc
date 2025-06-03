import React, { ReactNode } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function PageContainer({
  children,
  scrollable = true,
}: {
  children: ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="w-full h-full">
          <div className="p-4 md:px-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className="w-full p-5">{children}</div>
      )}
    </>
  );
}