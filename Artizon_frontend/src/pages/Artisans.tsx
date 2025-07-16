import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArtisansBreadcrumb } from '@/components/artisans/ArtisansBreadcrumb';
import { ArtisansHeroBanner } from '@/components/artisans/ArtisansHeroBanner';
import React, { Suspense } from 'react';
import { FloatingCart } from '@/components/FloatingCart';

const ArtisansMap = React.lazy(() => import('@/components/artisans/ArtisansMap'));
import { ArtisansGrid } from '@/components/artisans/ArtisansGrid';

const Artisans = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32">
        <ArtisansBreadcrumb />
        <ArtisansHeroBanner />
        <Suspense fallback={<div>Chargement de la carte...</div>}>
          <ArtisansMap />
        </Suspense>
        <ArtisansGrid />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Artisans;
