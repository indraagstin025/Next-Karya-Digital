"use client";

import React, { Suspense } from "react";
import Providers from "@/components/Providers";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SidebarInset } from "@/components/ui/sidebar";
import type {
  ActiveTab,
  CmsEmergencyOverview,
  StructuredSubTab,
} from "./types";
import type { CmsStaffUser } from "@/lib/cms-server";

export interface AdminTemplateShellProps {
  currentUser: CmsStaffUser;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subTab: StructuredSubTab;
  setStructuredSubTab: (sub: StructuredSubTab) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  loading: boolean;
  mutating: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  counts: {
    posts: number;
    portfolios: number;
    services: number;
    structured: number;
    media: number;
    leads: number;
    emergency: number;
  };
  emergencyOverview: CmsEmergencyOverview | null;
  children: React.ReactNode;
}

export function AdminTemplateShell({
  children,
}: AdminTemplateShellProps) {
  return (
    <Providers sidebarDefaultOpen={true}>
      <div className="flex min-h-screen w-full min-w-0 bg-background text-foreground antialiased">
        <Suspense>
          <Sidebar />
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
