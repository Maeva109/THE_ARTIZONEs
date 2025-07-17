
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProductsSection } from '@/components/ProductsSection';
import { ArtisanCarousel } from '@/components/ArtisanCarousel';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { TutorialsSection } from '@/components/TutorialsSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { CreateShopSection } from '@/components/CreateShopSection';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#EDF0E0]">
      <Header />
      <div className="h-56 md:h-40"></div>
      <main>
        <HeroBanner />
        <CategoriesSection />
        <ProductsSection />
        <ArtisanCarousel />
        <TestimonialsSection />
        <TutorialsSection />
        <HowItWorksSection />
        <CreateShopSection />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Index;
