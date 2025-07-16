
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  {
    id: 1,
    src: "/lovable-uploads/56ad55d4-63fc-4104-9c94-0a1dd4377792.png",
    alt: "Formation en bijouterie",
    overlayText: "Bijouterie"
  },
  {
    id: 2,
    src: "/lovable-uploads/7bc3fd40-75e4-4387-a5c3-373b6eb7e2db.png",
    alt: "Atelier de sculpture",
    overlayText: "Sculpture"
  },
  {
    id: 3,
    src: "/lovable-uploads/89c3c52f-cca5-4bd1-a006-8f10a523c694.png",
    alt: "Formation collective en tissage",
    overlayText: "Atelier collectif"
  },
  {
    id: 4,
    src: "/lovable-uploads/0d3c0a64-d150-4c57-9aae-f319245d1283.png",
    alt: "Technique de vannerie",
    overlayText: "Vannerie"
  }
];

export const TutorialsBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-orange-50 mt-20 px-4 py-16">
      <div className="container mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
          <div className="grid lg:grid-cols-2 h-full">
            {/* Left side - Text content */}
            <div className="flex flex-col justify-center p-8 lg:p-12 bg-gradient-to-br from-[#405B35]/5 to-orange-50/30">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#405B35] mb-6 leading-tight">
                Formez-vous avec les meilleurs artisans africains
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                Découvrez des formations authentiques et structurées pour maîtriser les techniques artisanales traditionnelles du Cameroun.
              </p>
              <div>
                <Button 
                  className="bg-[#405B35] hover:bg-[#405B35]/90 text-white px-8 py-4 text-lg rounded-full"
                  size="lg"
                >
                  Découvrir les formations
                </Button>
              </div>
            </div>

            {/* Right side - Image carousel */}
            <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
              <div className="relative w-full h-full overflow-hidden">
                {carouselImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay with text */}
                    <div className="absolute inset-0 bg-black/30">
                      <div className="absolute bottom-6 left-6">
                        <span className="bg-white/90 text-[#405B35] px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                          {image.overlayText}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#405B35] p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#405B35] p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Aller à l'image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
