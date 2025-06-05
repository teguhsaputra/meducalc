"use client";

import { ReactNode } from "react";
import Header from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarCustom } from "@/components/layout/sidebar-custom";
import { sidebarConfig } from "@/config/nav";
import PageContainer from "@/components/layout/page-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import MobileSidebar from "@/components/layout/mobile-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const formatCrumb = (crumb: string) => {
    return crumb
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <>
      <Header />

      <div className="flex min-h-screen">
        <aside className="fixed top-24 z-30 hidden w-[250px] h-[calc(100vh-6rem)] rounded-tr-[30px] shrink-0 md:block bg-[#2262C6]">
          <ScrollArea className="h-full px-4 py-6 pr-6 lg:py-8">
            <SidebarCustom />
          </ScrollArea>
        </aside>
        <main className="flex-1 md:ml-[250px] min-h-[calc(100vh-6rem)] overflow-y-auto pt-20 md:pt-24">
          <PageContainer scrollable={false}>
            <div>
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const href = `/${pathSegments
                      .slice(0, index + 1)
                      .join("/")}`;
                    const crumbText = formatCrumb(segment);

                    return (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="text-foreground font-medium">
                              {crumbText}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={href}
                              className="text-muted-foreground"
                            >
                              {crumbText}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
              {children}
            </div>
          </PageContainer>
        </main>
      </div>
    </>
  );
}
