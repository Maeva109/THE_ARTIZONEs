
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const heroImages = [
  {
    src: '/lovable-uploads/mon.jpg',
    alt: 'Palette de couleurs artisanales'
  },
  {
    src: '/lovable-uploads/gyy.jpg',
    alt: 'Palette de couleurs artisanales'
  },
  {
    src: '/lovable-uploads/shoes.jpg',
    alt: 'Palette de couleurs artisanales'
  },
  {
    src: '/lovable-uploads/yyyooo.jpg',
    alt: 'Art créatif africain'
  },
  {
    src: '/lovable-uploads/tam.jpg',
    alt: 'Art créatif africain'
  },
  {
    src: '/lovable-uploads/0d3c0a64-d150-4c57-9aae-f319245d1283.png',
    alt: 'Art visuel créatif'
  },
  {
    src: '/lovable-uploads/ndop.jpg',
    alt: 'Art coloré et vibrant'
  },
  {
    src: '/lovable-uploads/bijou.jpg',
    alt: 'Fils de laine colorés artisanaux'
  },
  {
    src: '/lovable-uploads/saty.jpg',
    alt: 'Artisanat traditionnel camerounais'
  },
  {
    src: '/lovable-uploads/1.jpg',
    alt: 'Tissage traditionnel'
  },
  {
    src: '/lovable-uploads/f4.jpg',
    alt: 'Sculpture artisanale'
  }
];

export const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleDiscoverArtisans = () => {
    setIsClicked(true);
    setTimeout(() => {
      navigate('/artisans');
      setIsClicked(false);
    }, 200);
  };

  return (
    <section className="relative min-h-[350px] sm:min-h-[450px] md:min-h-[600px] flex items-center justify-center overflow-hidden px-2 sm:px-0">
      {/* Carousel container */}
      <div className="absolute inset-0">
        <div 
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image.src})` }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10"
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10"
        aria-label="Image suivante"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Content overlay - Responsive */}
      <div className="relative z-10 text-center text-white px-2 sm:px-4 max-w-2xl sm:max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
          <span className="block">Découvrez l'Art Authentique</span>
          <span className="block text-orange-400">du Cameroun</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl mb-4 sm:mb-8 text-gray-200 max-w-xl sm:max-w-2xl mx-auto">
          Connectez-vous avec les artisans talentueux de l'Ouest Cameroun et découvrez des créations uniques faites à la main avec passion et tradition.
        </p>
        <Button 
          size="lg" 
          onClick={handleDiscoverArtisans}
          className={`bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto ${
            isClicked ? 'scale-95 bg-orange-700' : ''
          }`}
        >
          <Sparkles className="h-5 w-5" />
          Découvrir les artisans
        </Button>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-orange-400 scale-125' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
