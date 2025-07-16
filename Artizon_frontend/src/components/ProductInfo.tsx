import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Minus, Plus, ExternalLink } from 'lucide-react';
import { SocialShare } from '@/components/SocialShare';
import { useCart } from '@/context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  availability: string;
  description: string;
  materials: string;
  dimensions: string;
  variants: string[];
  badge?: string;
  artisan: {
    id: number;
    name: string;
    photo: string;
    city: string;
    country: string;
    shopName?: string;
  };
  is_in_stock: boolean;
}

interface ProductInfoProps {
  product: Product;
  onContactArtisan: () => void;
  onArtisanShopClick?: () => void;
}

export const ProductInfo = ({ product, onContactArtisan, onArtisanShopClick }: ProductInfoProps) => {
  const variants = product.variants ?? [];
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const BACKEND_URL = 'http://localhost:8000';
  const [addToCartStatus, setAddToCartStatus] = useState<string | null>(null);
  const { fetchCart } = useCart();

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setAddToCartStatus(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });
      if (!res.ok) {
        let msg = "Erreur lors de l'ajout au panier.";
        try {
          const data = await res.json();
          if (data && data.error) {
            if (data.error === 'Insufficient stock.') {
              msg = 'Stock insuffisant pour ce produit.';
            } else if (data.error === 'Product not found or inactive.') {
              msg = 'Produit non trouvé ou inactif.';
            } else {
              msg = data.error;
            }
          }
        } catch {}
        setAddToCartStatus(msg);
      } else {
        setAddToCartStatus('Produit ajouté au panier !');
        fetchCart();
      }
    } catch {
      setAddToCartStatus('Erreur réseau.');
    }
  };

  const handleBuyNow = () => {
    console.log('Buy now:', {
      product: product.name,
      quantity,
      variant: selectedVariant
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Price */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {product.name}
          </h1>
          {product.badge && (
            <Badge 
              className={`${
                product.badge === 'Nouveau' ? 'bg-orange-500' : 
                product.badge === 'Promo' ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {product.badge}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-[#405B35]">
            {product.price.toLocaleString()} FCFA
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              {product.originalPrice.toLocaleString()} FCFA
            </span>
          )}
        </div>
        <p className={product.is_in_stock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {product.is_in_stock ? 'En stock' : 'Rupture de stock'}
        </p>
      </div>

      {/* Product Description */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-800">Matériaux:</span>
          <span className="text-gray-600 ml-2">
            {product.materials ? product.materials : <span className="italic text-gray-400">Non spécifié</span>}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-800">Dimensions:</span>
          <span className="text-gray-600 ml-2">
            {product.dimensions ? product.dimensions : <span className="italic text-gray-400">Longueur: 45cm, Largeur: 2cm</span>}
          </span>
        </div>
      </div>

      {/* Variants Selection */}
      {variants.length > 0 ? (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Variantes</h3>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedVariant === variant
                    ? 'border-[#405B35] bg-[#405B35] text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Variantes</h3>
          <span className="italic text-gray-400">Aucune variante</span>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Quantité</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white py-3"
        >
          Ajouter au panier
        </Button>
        {addToCartStatus && (
          <div className={addToCartStatus.includes('ajout') ? 'text-green-600 mt-2' : 'text-red-600 mt-2'}>
            {addToCartStatus}
          </div>
        )}
        <Button 
          onClick={handleBuyNow}
          variant="outline"
          className="w-full border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white py-3"
        >
          Acheter maintenant
        </Button>
      </div>

      {/* Artisan Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Artisan</h3>
          <div className="flex items-start gap-4">
            <img 
              src={product.artisan?.photo || '/placeholder.png'} 
              alt={product.artisan?.name || 'Artisan'}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800">{product.artisan?.name || 'Artisan inconnu'}</h4>
                {onArtisanShopClick && product.artisan?.shopName && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onArtisanShopClick}
                    className="text-[#405B35] hover:text-[#405B35]/80 p-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {product.artisan?.city || ''}{product.artisan?.city && product.artisan?.country ? ', ' : ''}{product.artisan?.country || ''}
              </p>
              {onArtisanShopClick && product.artisan?.shopName && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onArtisanShopClick}
                  className="text-[#405B35] border-[#405B35] hover:bg-[#405B35] hover:text-white mb-2"
                >
                  Voir la boutique
                </Button>
              )}
              <Button
                onClick={onContactArtisan}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contacter l'artisan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Share */}
      <SocialShare productName={product.name} />

      {/* Delivery and Payment Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Livraison & Paiement</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Modes de livraison:</strong> Retrait en magasin, Livraison à domicile</p>
            <p><strong>Délais:</strong> 2-5 jours ouvrés</p>
            <p><strong>Frais de livraison:</strong> 2,500 FCFA (gratuit dès 50,000 FCFA)</p>
            <p><strong>Paiement:</strong> Mobile Money, Carte bancaire, Espèces</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
