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

interface MobileSidebarProps {}

const MobileSidebar: FC<MobileSidebarProps> = ({}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>Menu</SheetTrigger>
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
