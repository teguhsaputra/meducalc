"use client";

import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { SidebarCustom } from "./sidebar-custom";
import { Button } from "../ui/button";

interface MobileSidebarProps {}

const MobileSidebar: FC<MobileSidebarProps> = ({}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="group" variant="outline" size="icon">
            <svg
              className="pointer-events-none"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L20 12"
                className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
              />
              <path
                d="M4 12H20"
                className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
              />
              <path
                d="M4 12H20"
                className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div>
              <SheetTitle className="mb-4 text-3xl p-5 font-semibold tracking-tight">
                Meducalc App
              </SheetTitle>
              <div className=" rounded-tr-[30px] shrink-0 h-screen bg-[#2262C6] p-5">
                <SidebarCustom />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
