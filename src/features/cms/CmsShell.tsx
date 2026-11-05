"use client";

import React, { Suspense } from "react";
import Providers from "@/components/Providers";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SidebarInset } from "@/components/ui/sidebar";

export function CmsShell({
  children,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  return (
    <Providers sidebarDefaultOpen={false}>
      <div className="flex min-h-screen w-full min-w-0 bg-background text-foreground antialiased">
        <Suspense>
          <Sidebar isAdmin={isAdmin} />
        </Suspense>
        <SidebarInset className="flex flex-1 flex-col [zoom:0.9]" style={{ zoom: 0.9 }}>
          <Header />
          <main className="mx-auto size-full max-w-360 flex-1 px-4 py-6 sm:px-6">
            {children}
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </Providers>
  );
}

export default CmsShell;
