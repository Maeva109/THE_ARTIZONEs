import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { CatalogueBreadcrumb } from '@/components/CatalogueBreadcrumb';
import { CatalogueBanner } from '@/components/CatalogueBanner';
import { CatalogueMain } from '@/components/CatalogueMain';
import { Sparkles } from 'lucide-react';

interface Filters {
  category: string;
  priceRange: number[];
  artisan: string;
  location: string;
  promotions: boolean;
  nouveautes: boolean;
  search: string;
}

const Catalogue = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search') || '';
  
  const [filters, setFilters] = useState<Filters>({
    category: categoryFromUrl || '',
    priceRange: [0, 100000],
    artisan: '',
    location: '',
    promotions: false,
    nouveautes: false,
    search: searchFromUrl,
  });

  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: categoryFromUrl || '',
      search: searchFromUrl,
    }));
    if (categoryFromUrl) {
      setShowWelcomeAnimation(true);
      setTimeout(() => setShowWelcomeAnimation(false), 2000);
    }
  }, [categoryFromUrl, searchFromUrl]);

  const handleProductClick = (productId: number) => {
    navigate(`/produit/${productId}`);
  };

  const getPageTitle = () => {
    if (filters.category) {
      return `Catégorie ${filters.category}`;
    }
    return 'Notre Catalogue Artisanal';
  };

  const getPageDescription = () => {
    if (filters.category) {
      return `Découvrez notre sélection exceptionnelle de produits artisanaux dans la catégorie ${filters.category}. Chaque création raconte une histoire unique et met en valeur le savoir-faire de nos artisans passionnés.`;
    }
    return 'Explorez notre collection complète de produits artisanaux authentiques, créés avec passion par nos artisans talentueux du Cameroun.';
  };

  return (
    <div className="min-h-screen bg-[#EDF0E0]">
      <Header />
      <div className="pt-24 md:pt-32">
      
      {/* Welcome Animation */}
      {showWelcomeAnimation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center transform animate-scale-in">
            <Sparkles className="h-16 w-16 text-[#405B35] mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-[#405B35] mb-2">
              Bienvenue dans {getPageTitle()}!
            </h2>
            <p className="text-gray-600">
              Découvrez des créations uniques qui vous attendent
            </p>
          </div>
        </div>
      )}
      
      {/* Breadcrumb Navigation */}
      <CatalogueBreadcrumb selectedCategory={filters.category} />

      {/* Page Title Section - Corrigé pour éviter la coupure */}
      <section className="py-12 px-4 bg-white border-b border-gray-200">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-[#405B35] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#405B35] leading-tight">
              {getPageTitle()}
            </h1>
            <Sparkles className="h-8 w-8 text-orange-500 flex-shrink-0" />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#405B35] to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            {getPageDescription()}
          </p>
        </div>
      </section>

      {/* Split Hero Banner */}
      <CatalogueBanner />

      {/* Main Catalogue Section */}
      <CatalogueMain 
        filters={filters}
        onFilterChange={setFilters}
        onProductClick={handleProductClick}
      />

      </div>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Catalogue;
