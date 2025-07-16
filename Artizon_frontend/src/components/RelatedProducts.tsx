import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string;
  images?: string[];
}

interface RelatedProductsProps {
  title: string;
  products: RelatedProduct[];
  onProductClick: (productId: number) => void;
}

export function RelatedProducts({ title, products, onProductClick }: RelatedProductsProps) {
  if (!products.length) return null;
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-3 flex flex-col"
            onClick={() => onProductClick(product.id)}
          >
            <img
              src={Array.isArray(product.images) ? product.images[0] : product.images || '/placeholder.png'}
              alt={product.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <div className="flex-1">
              <div className="font-semibold">{product.name}</div>
              <div className="text-[#405B35] font-bold">{product.price} FCFA</div>
              {product.badge && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
