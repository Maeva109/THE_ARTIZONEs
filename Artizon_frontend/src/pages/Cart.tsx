import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Trash2, Lock, ShoppingBag, CreditCard, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PaymentModal } from '@/components/PaymentModal';

const BACKEND_URL = 'http://localhost:8000';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    images?: string;
    badge?: string;
    category?: string;
    artisan?: string;
  };
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [deliveryFees] = useState(2500);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  // Mock user authentication status - in real app, this would come from auth context
  const [isUserLoggedIn] = useState(false);

  // Fetch cart items from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/cart/`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCartItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    fetch(`${BACKEND_URL}/api/cart/${itemId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ quantity: newQuantity })
    })
      .then(res => res.json())
      .then(data => setCartItems(data.items || []));
  };

  const removeItem = (itemId: number) => {
    fetch(`${BACKEND_URL}/api/cart/${itemId}/`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCartItems(data.items || []));
  };

  const handlePaymentMethodClick = (method: string) => {
    setSelectedPaymentMethod(method);
    setIsPaymentModalOpen(true);
  };

  const handleCommanderClick = () => {
    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }
    // If logged in, proceed with order process
    console.log('Processing order...');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal + deliveryFees;

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
    return 'https://via.placeholder.com/200x200';
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#EDF0E0]">
        <Header />
        <div className="container mx-auto px-4 py-16 mt-20">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Votre panier est vide !
            </h1>
            <p className="text-gray-600 mb-8">
              Découvrez nos magnifiques créations artisanales
            </p>
            <Button asChild className="bg-[#405B35] hover:bg-[#405B35]/90 text-white px-8 py-3">
              <Link to="/catalogue">
                Découvrir nos produits
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF0E0]">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24 md:pt-32">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mon Panier</h1>
        
        {/* Top Description */}
        <div className="text-center mb-8 py-6 bg-white rounded-lg shadow-sm">
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Vérifiez votre sélection et choisissez votre mode de paiement sécurisé. Tous vos achats sont protégés et traités rapidement.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={getProductImage(item.product)} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link 
                            to={`/produit/${item.product.id}`}
                            className="font-semibold text-gray-900 hover:text-[#405B35] cursor-pointer"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.artisan && (
                            <p className="text-sm text-gray-600 hover:text-[#405B35] cursor-pointer">
                              Par {item.product.artisan}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {item.product.category}
                            </span>
                            {item.product.badge && (
                              <span className={`text-xs px-2 py-1 rounded text-white ${
                                item.product.badge === 'Nouveau' ? 'bg-orange-500' : 
                                item.product.badge === 'Promo' ? 'bg-red-500' : 'bg-green-500'
                              }`}>
                                {item.product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {item.product.price.toLocaleString()} FCFA × {item.quantity}
                          </p>
                          <p className="font-bold text-[#405B35]">
                            {(item.product.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Résumé de la commande
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>{deliveryFees.toLocaleString()} FCFA</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#405B35]">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Code promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      Appliquer
                    </Button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <p className="font-medium text-gray-900 mb-3">Moyens de paiement:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 p-3 h-auto"
                      onClick={() => handlePaymentMethodClick('Orange Money')}
                    >
                      <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🍊</span>
                      </div>
                      <span className="text-sm">Orange Money</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 p-3 h-auto"
                      onClick={() => handlePaymentMethodClick('Mobile Money')}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-sm">Mobile Money</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 p-3 h-auto col-span-2"
                      onClick={() => handlePaymentMethodClick('Carte Bancaire')}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Carte Bancaire</span>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleCommanderClick}
                    className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white py-3 text-lg font-semibold"
                  >
                    Commander
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/catalogue">
                      Continuer mes achats
                    </Link>
                  </Button>
                </div>

                {/* Security Message */}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span>Paiement 100% sécurisé. Retours faciles.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentMethod={selectedPaymentMethod}
        total={total}
      />
    </div>
  );
};

export default Cart;
