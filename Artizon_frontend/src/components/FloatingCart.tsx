import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const BACKEND_URL = 'http://localhost:8000';

const getProductImage = (product: any) => {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0].startsWith('http')
      ? product.images[0]
      : `http://localhost:8000${product.images[0]}`;
  }
  if (typeof product.images === 'string' && product.images) {
    return product.images.startsWith('http')
      ? product.images
      : `http://localhost:8000${product.images}`;
  }
  return '/placeholder.png';
};

export const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, totalAmount } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#405B35] hover:bg-[#405B35]/90 text-white px-6 py-4 rounded-full shadow-lg relative"
        >
          <span className="text-xl mr-2">🛒</span>
          <span className="font-semibold">{totalAmount.toLocaleString()} FCFA</span>
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="shadow-xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#405B35]">Mon Panier</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItems.length === 0 && <div className="text-gray-500 text-center">Votre panier est vide.</div>}
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <img 
                      src={getProductImage(item.product)} 
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-600">Qté: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#405B35] text-sm">{(item.product.price * item.quantity).toLocaleString()} FCFA</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#405B35]">Total:</span>
                  <span className="font-bold text-lg text-[#405B35]">{totalAmount.toLocaleString()} FCFA</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Frais de livraison: 2,500 FCFA</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button asChild className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white">
                  <Link to="/panier">
                    Voir le panier complet
                  </Link>
                </Button>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Commander maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
