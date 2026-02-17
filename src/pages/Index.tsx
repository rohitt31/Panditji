import HeroSection from "@/components/HeroSection";
import ServicesOverview from "@/components/ServicesOverview";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingCTA from "@/components/BookingCTA";
import InstagramSection from "@/components/InstagramSection";
import Layout from "@/components/Layout";
import AartiMemberSection from "@/components/AartiMemberSection"; // Newly added
import DynamicAartiCards from "@/components/DynamicAartiCards";

const Index = () => {
  return (
    <Layout>
      <HeroSection />

      {/* Official Ganga Aarti Member Section */}
      <AartiMemberSection />

      {/* Dynamic Cards Section (Managed via Admin) */}
      <DynamicAartiCards />

      <ServicesOverview />
      <TestimonialsSection />
      <BookingCTA />
      <InstagramSection />
    </Layout>
  );
};

export default Index;
