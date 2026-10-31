"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleMapsEmbed } from "@/components/GoogleMapsEmbed";
import { ContactHero } from "../components/ContactHero";
import { ContactInfoList } from "../components/ContactInfoList";
import { ContactForm } from "../components/ContactForm";

export function ContactPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nk-theme-preference");
    if (saved === "dark") {
      setIsDark(true);
    }
  }, []);

  return (
    <div
      id="nk-site"
      className={`site-wrap min-h-screen flex flex-col ${isDark ? "theme-dark" : ""}`}
      suppressHydrationWarning
    >
      <Navbar />

      <main className="flex-1 pt-[68px] lg:pt-[76px]">
        <ContactHero />

        <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#F3F8FF] dark:from-[#030711] dark:via-[#061231] dark:to-[#091a45] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <ContactInfoList />
            <ContactForm />
          </div>

          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 mt-12 sm:mt-16">
            <GoogleMapsEmbed />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
