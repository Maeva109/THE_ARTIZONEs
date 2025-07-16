import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const BACKEND_URL = 'http://localhost:8000';

export const CategoriesSection = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories/`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : data.results || []));
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/catalogue?category=${encodeURIComponent(categoryName)}`);
  };

  const handleViewAllCategories = () => {
    setIsClicked(true);
    setTimeout(() => {
      navigate('/catalogue');
      setIsClicked(false);
    }, 200);
  };

  const getImageUrl = (img: string) => {
    if (!img) return '/placeholder.svg';
    if (img.startsWith('http')) return img;
    return `${BACKEND_URL}${img}`;
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-4">
            Explorez nos Catégories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez une large gamme de produits artisanaux authentiques
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full overflow-visible mb-8"
        >
          <CarouselContent className="-ml-2 md:-ml-4 overflow-visible">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 lg:basis-1/4 overflow-visible">
                <Card
                  onClick={() => handleCategoryClick(category.name)}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 overflow-hidden bg-white active:scale-95"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🗂️</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-800 group-hover:text-[#405B35] transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center">
          <Button
            onClick={handleViewAllCategories}
            className={`bg-[#405B35] hover:bg-[#405B35]/90 text-white px-8 py-3 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto ${
              isClicked ? 'scale-95 bg-[#405B35]/80' : ''
            }`}
          >
            Voir toutes les catégories
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
