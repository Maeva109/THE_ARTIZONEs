import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

export const ProductsSection = () => {
  const navigate = useNavigate();
  const [isViewAllClicked, setIsViewAllClicked] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products/`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.results || []));
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/produit/${productId}`);
  };

  const handleViewAllClick = () => {
    setIsViewAllClicked(true);
    setTimeout(() => {
      navigate('/catalogue');
      setIsViewAllClicked(false);
    }, 200);
  };

  const getImageUrl = (img: string) => {
    if (!img) return '/placeholder.svg';
    if (img.startsWith('http')) return img;
    return `${BACKEND_URL}${img}`;
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-4">
            Nouveautés & Populaires
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les dernières créations et les produits les plus appréciés
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.slice(0, 8).map((product) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 active:scale-95"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                <img 
                  src={getImageUrl(product.images)} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      product.badge === 'Nouveau' ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-[#405B35] transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-[#405B35] mb-3">{Number(product.price).toLocaleString()} FCFA</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Adding to cart:', product.name);
                    }}
                  >
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleViewAllClick}
            className={`bg-[#405B35] hover:bg-[#405B35]/90 text-white px-8 py-3 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto ${
              isViewAllClicked ? 'scale-95 bg-[#405B35]/80' : ''
            }`}
          >
            Voir tous nos produits
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
