"use client";

import { sidebarConfig, SidebarConfig } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useGetMe } from "@/services/api/auth";
import { SidebarNavItem } from "@/types/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export interface SidebarCustomProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function SidebarCustom({ setOpen }: SidebarCustomProps) {
  const pathname = usePathname();
  const { data } = useGetMe();

  const config = sidebarConfig[data?.role];
  const items = config?.sidebarNav;
  // const config = sidebarConfig[data?.role]

  return (  
    items?.length && (
      <div className="w-full">
        {items.map((item, index) => (
          <div key={index} className={cn("pb-4")}>
            <h4 className="mb-1 rounded-md px-2 text-sm font-semibold">
              {item.title}
            </h4>
            {item.items?.length && (
              <SidebarCustomItems
                items={item.items}
                pathname={pathname}
                setOpen={setOpen}
              />
            )}
          </div>
        ))}
        <div></div>
      </div>
    )
  );
}

interface SidebarCustomItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function SidebarCustomItems({
  items,
  pathname,
  setOpen,
}: SidebarCustomItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex w-full items-center rounded-md border border-transparent px-2 py-2",
              item.disabled && "cursor-not-allowed opacity-60",
              pathname?.startsWith(item.href)
                ? "font-medium text-[#2262C6] bg-[#F1F5F9]"
                : "text-white "
            )}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              "flex w-full cursor-not-allowed items-center gap-x-2 rounded-md p-2 text-muted-foreground hover:underline",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null;
}
