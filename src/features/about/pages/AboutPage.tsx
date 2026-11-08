import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AboutHero } from "../components/AboutHero";
import { AboutProfile } from "../components/AboutProfile";
import { AboutValues } from "../components/AboutValues";

export function AboutPage() {
  return (
    <div
      id="nk-site"
      data-nk-smooth-wrapper
      className="site-wrap min-h-screen flex flex-col"
    >
      <Navbar />

      <main className="flex-1 pt-[68px] lg:pt-[76px]">
        <AboutHero />

        <section className="relative isolate overflow-hidden bg-[#F8FAFC] dark:bg-[#030711] py-16 sm:py-20">
          <AboutProfile />
          <AboutValues />
        </section>
      </main>

      <Footer />
    </div>
  );
}
