import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import type {
  PublicFaqDTO,
  PublicPortfolioDTO,
  PublicPricingPlanDTO,
  PublicServiceDTO,
} from "@/lib/public-content";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ServicesSection } from "../components/ServicesSection";
import { WorkflowSection } from "../components/WorkflowSection";
import { PortfolioSection } from "../components/PortfolioSection";
import { PricingSection } from "../components/PricingSection";
import { FaqSection } from "../components/FaqSection";
import { ContactSection } from "../components/ContactSection";

export interface HomePageProps {
  services?: PublicServiceDTO[] | null;
  portfolios?: PublicPortfolioDTO[] | null;
  pricing?: PublicPricingPlanDTO[] | null;
  faqs?: PublicFaqDTO[] | null;
}

export function HomePage({
  services,
  portfolios,
  pricing,
  faqs,
}: HomePageProps) {
  return (
    <ThemeWrapper>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection services={services} />
        <WorkflowSection />
        <PortfolioSection portfolios={portfolios} />
        <PricingSection plans={pricing} />
        <FaqSection faqs={faqs} />
        <ContactSection />
      </main>
      <Footer />
    </ThemeWrapper>
  );
}
