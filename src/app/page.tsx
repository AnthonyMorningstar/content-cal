// ============================================
// Landing Page
// ============================================
// The public-facing marketing page that
// converts visitors into registered users

import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/PricingSection";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PricingSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}