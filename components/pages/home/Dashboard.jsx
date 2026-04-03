"use client";

import Header from "@/components/common/Header";
import KpiCards from "./KpiCards";
import SocialTabs from "./SocialTabs";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        <Header />

        <KpiCards />

        <SocialTabs />
      </div>
    </div>
  );
}
