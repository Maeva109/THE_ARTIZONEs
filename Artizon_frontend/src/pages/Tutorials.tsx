
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { Button } from '@/components/ui/button';
import { FieldTabs } from '@/components/tutorials/FieldTabs';
import { TutorialFilters } from '@/components/tutorials/TutorialFilters';
import { TutorialsBannerCarousel } from '@/components/tutorials/TutorialsBannerCarousel';
import { Sparkles, BookOpen, Users, Plus, Send } from 'lucide-react';

const Tutorials = () => {
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState("Toutes");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedLevel, setSelectedLevel] = useState("Tous");
  const [selectedFormat, setSelectedFormat] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProposeTutorial = () => {
    navigate('/proposer-tutoriel');
  };

  return (
    <div className="min-h-screen bg-[#EDF0E0] pt-32 md:pt-36 overflow-x-hidden w-full max-w-full">
      <Header />
      
      {/* Welcome Animation */}
      {showWelcomeAnimation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-4 sm:p-8 text-center transform animate-scale-in w-11/12 max-w-md mx-auto">
            <BookOpen className="h-10 w-10 sm:h-16 sm:w-16 text-[#405B35] mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#405B35] mb-2">
              Bienvenue dans vos Tutoriels!
            </h2>
            <p className="text-base sm:text-gray-600">
              Découvrez nos formations artisanales exceptionnelles
            </p>
          </div>
        </div>
      )}
      
      {/* Banner Carousel Section */}
      <div className="mb-4 sm:mb-8">
        <TutorialsBannerCarousel />
      </div>

      {/* Page Title Section */}
      <section className="py-6 sm:py-8 px-2 sm:px-4 bg-white border-b border-gray-200">
        <div className="container mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-[#405B35]" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#405B35]">
              Tutoriels
            </h1>
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Accédez à notre bibliothèque complète de formations artisanales. Développez vos compétences avec des tutoriels conçus par des experts passionnés.
          </p>
        </div>
      </section>

      {/* Elegant Section Title */}
      <section className="py-8 sm:py-12 md:py-16 px-2 sm:px-4">
        <div className="container mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-[#405B35]" />
            <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#405B35] leading-tight">
              Explorez Nos Parcours de Formation Artisanale
            </h2>
            <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500 animate-pulse" />
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#405B35] to-orange-500 mx-auto mb-4 sm:mb-8 rounded-full"></div>
          <p className="text-base sm:text-xl text-gray-600 max-w-xl sm:max-w-3xl mx-auto leading-relaxed">
            Des formations complètes et structurées pour développer vos compétences artisanales, 
            de l'initiation à la maîtrise des techniques traditionnelles camerounaises.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-2 sm:px-4 pb-8 sm:pb-12 w-full max-w-full">
        {/* Section Filtres et recherche */}
        <div className="mb-6 sm:mb-8">
          <TutorialFilters
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Section Plans de formation par filière */}
        <div className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-3xl font-bold text-[#405B35] mb-4 sm:mb-8 text-center">
            Plans de formation par filière et catégorie
          </h3>
          <FieldTabs />
        </div>

        {/* Section Proposer un tutoriel - Améliorée */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {/* Partager son savoir-faire */}
          <div className="bg-gradient-to-br from-[#405B35] to-[#405B35]/80 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-orange-300" />
                <h3 className="text-lg sm:text-2xl font-bold">
                  Partager votre savoir-faire
                </h3>
              </div>
              <p className="text-white/90 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Vous êtes un expert dans votre domaine ? Partagez votre expertise avec notre communauté d'artisans 
                et contribuez à l'enrichissement de nos formations professionnelles.
              </p>
              <Button 
                onClick={handleProposeTutorial}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Proposer un tutoriel
              </Button>
            </div>
          </div>

          {/* Statistiques et encouragement */}
          <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#405B35]" />
                <h3 className="text-lg sm:text-2xl font-bold text-[#405B35]">
                  Rejoignez nos formateurs
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-orange-500 mb-1 sm:mb-2">150+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Tutoriels actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-[#405B35] mb-1 sm:mb-2">5,000+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Apprenants</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-base">
                Rejoignez une communauté de formateurs passionnés et faites découvrir vos techniques traditionnelles 
                à des milliers d'apprenants motivés.
              </p>
              <Button 
                onClick={handleProposeTutorial}
                variant="outline" 
                className="border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white w-full sm:w-auto px-4 sm:px-6 py-2 rounded-full transition-all duration-300"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Tutorials;
