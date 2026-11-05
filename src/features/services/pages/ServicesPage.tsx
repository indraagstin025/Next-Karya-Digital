import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { PublicPricingPlanDTO, PublicServiceDTO } from "@/lib/public-content";
import { ServicesHero } from "../components/ServicesHero";
import { ServiceCards } from "../components/ServiceCards";
import { ServicePricing } from "../components/ServicePricing";
import { ServiceWorkflow } from "../components/ServiceWorkflow";

export function ServicesPage({
  services,
  pricing,
}: {
  services?: PublicServiceDTO[] | null;
  pricing?: PublicPricingPlanDTO[] | null;
}) {
  return (
    <div
      id="nk-site"
      className="site-wrap min-h-screen flex flex-col"
    >
      <Navbar />

      <main className="flex-1 pt-[68px] lg:pt-[76px]">
        <ServicesHero />

        <section className="relative isolate overflow-hidden bg-[#F8FAFC] dark:bg-[#030711] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
            <ServiceCards services={services} />
            <ServicePricing plans={pricing} />
            <ServiceWorkflow />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
