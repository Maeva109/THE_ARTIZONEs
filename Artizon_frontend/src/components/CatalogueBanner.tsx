import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:8000';

export const CatalogueBanner = () => {
  const fallbackCategories = [
    {
      name: "Bijoux",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
      description: "Colliers, bracelets et boucles d'oreilles artisanaux"
    },
    {
      name: "Textile",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600&h=400&fit=crop",
      description: "Tissages traditionnels et modernes"
    },
    {
      name: "Sculpture",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop",
      description: "Œuvres sculptées en bois et argile"
    },
    {
      name: "Décoration",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      description: "Objets décoratifs pour votre intérieur"
    },
    {
      name: "Accessoires",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
      description: "Sacs, chaussures et accessoires de mode"
    }
  ];

  const [categories, setCategories] = useState<any[]>(fallbackCategories);
  const [currentShowcase, setCurrentShowcase] = useState(fallbackCategories[0]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          const randomIndex = Math.floor(Math.random() * data.length);
          setCurrentShowcase(data[randomIndex]);
        } else {
          // fallback
          const randomIndex = Math.floor(Math.random() * fallbackCategories.length);
          setCurrentShowcase(fallbackCategories[randomIndex]);
        }
      })
      .catch(() => {
        // fallback
        const randomIndex = Math.floor(Math.random() * fallbackCategories.length);
        setCurrentShowcase(fallbackCategories[randomIndex]);
      });
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Zone - Text Content */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Trouvez l'artisanat qui vous ressemble
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
              Des créations uniques sélectionnées pour vous par les meilleurs artisans de l'Ouest Cameroun
            </p>
            <div>
              <Button 
                size="lg" 
                className="bg-[#405B35] hover:bg-[#405B35]/90 text-white px-8 py-4 text-lg font-semibold rounded-full"
              >
                Parcourir maintenant
              </Button>
            </div>
          </div>

          {/* Right Zone - Dynamic Category Showcase */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-full min-h-[400px]">
            <img 
              src={currentShowcase.image || '/placeholder.png'} 
              alt={currentShowcase.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{currentShowcase.name}</h3>
              <p className="text-gray-200 mb-4">{currentShowcase.description || ''}</p>
              <Button 
                asChild
                size="sm" 
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6"
              >
                <Link to={`/catalogue?category=${encodeURIComponent(currentShowcase.name)}`}>
                  Parcourir maintenant
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
