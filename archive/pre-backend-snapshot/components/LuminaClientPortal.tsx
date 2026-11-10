"use client";

import React from "react";
import { StudioNavbar } from "./StudioNavbar";
import { HeroSection } from "./HeroSection";
import { FeaturedCaseStudy } from "./FeaturedCaseStudy";
import { SmartBriefWizard } from "./SmartBriefWizard";
import { StudioFooter } from "./StudioFooter";

export const LuminaClientPortal: React.FC = () => {
  const handleScrollToForm = () => {
    const el = document.getElementById("smart-brief-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Studio Header Bar */}
      <StudioNavbar />

      {/* 1. Hero Section */}
      <HeroSection onStartClick={handleScrollToForm} />

      {/* Featured Case Study Preview (Gió Mộc Coffee) */}
      <FeaturedCaseStudy />

      {/* 2 & 3. Smart Brief Stepper Form + Processing & Success State */}
      <main className="relative">
        <SmartBriefWizard />
      </main>

      {/* Studio Footer */}
      <StudioFooter />
    </div>
  );
};

export default LuminaClientPortal;
