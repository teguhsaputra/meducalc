import React, { useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import AlertLogout from "../alert-logout";
import { useGetMe } from "@/services/api/auth";
import MobileSidebar from "./mobile-sidebar";
import { ScrollArea } from "../ui/scroll-area";

export default function Header() {
  const { data } = useGetMe();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  return (
    <header className="fixed top-0 left-0 w-full h-16 md:h-24 shrink-0 flex items-center justify-between gap-2 px-3 md:px-10 bg-white z-40">
      <ScrollArea className="fixed md:hidden">
        <MobileSidebar />
      </ScrollArea>
      <div className="text-3xl font-bold md:block hidden">Meducalc App</div>
      <div className="flex items-center gap-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 text-base font-medium">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {data?.data?.username ? data?.data?.username.charAt(0) : ""}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2">
              <DropdownMenuItem>
                <span className="underline">{data?.data?.username}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertLogout onClick={handleLogout} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
