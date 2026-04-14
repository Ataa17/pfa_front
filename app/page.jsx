import Navbar           from "@/components/landing/Navbar";
import HeroSection      from "@/components/landing/HeroSection";
import FeaturesSection  from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AboutSection     from "@/components/landing/AboutSection";
import ContactSection   from "@/components/landing/ContactSection";
import Footer           from "@/components/landing/Footer";

export default function HomePage() {
  return (
     <div>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
    