import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { ProductInfo } from '@/components/ProductInfo';
import { ProductReviews } from '@/components/ProductReviews';
import { RelatedProducts } from '@/components/RelatedProducts';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

const BACKEND_URL = 'http://localhost:8000';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [artisanProducts, setArtisanProducts] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/api/products/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Produit non trouvé');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setError(null);

        // Fetch reviews
        fetch(`${BACKEND_URL}/api/reviews/?product=${id}`)
          .then(res => res.json())
          .then(setReviews);

        // Fetch related products
        fetch(`${BACKEND_URL}/api/products/${id}/related/`)
          .then(res => res.json())
          .then(setRelatedProducts);

        // Fetch other products by artisan
        if (data.artisan?.id) {
          fetch(`${BACKEND_URL}/api/products/${id}/artisan_products/`)
            .then(res => res.json())
            .then(setArtisanProducts);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContactArtisan = () => {
    // In real app, this would open the messaging system
    if (product?.artisan) {
      console.log('Opening messaging system with artisan:', product.artisan.name);
    }
  };

  const handleArtisanShopClick = () => {
    if (product?.artisan?.shopName) {
      navigate(`/artisan/${product.artisan.shopName}`);
    } else if (product?.artisan?.id) {
      navigate(`/artisan/${product.artisan.id}`);
    } else {
      navigate('/artisans');
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/produit/${productId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#EDF0E0]"><Header /><div className="container mx-auto py-20 text-center text-lg">Chargement du produit...</div><Footer /></div>;
  }
  if (error || !product) {
    return <div className="min-h-screen bg-[#EDF0E0]"><Header /><div className="container mx-auto py-20 text-center text-red-600">{error || 'Produit non trouvé'}</div><Footer /></div>;
  }

  // Prepare images for gallery (handle both string and array)
  const images = Array.isArray(product.images)
    ? product.images
    : product.images ? [product.images] : [];

  return (
    <div className="min-h-screen bg-[#EDF0E0]">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalogue">Catalogue</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/catalogue?category=${product.category}`}>{product.category}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Top Description */}
        <div className="text-center mb-8 py-6 bg-white rounded-lg shadow-sm">
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Découvrez tous les détails et l'histoire de ce produit artisanal unique, réalisé avec passion par nos créateurs locaux.
          </p>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImageGallery images={images} />
          <ProductInfo 
            product={product} 
            onContactArtisan={handleContactArtisan}
            onArtisanShopClick={handleArtisanShopClick}
          />
        </div>

        {/* Reviews Section */}
        <ProductReviews
          reviews={reviews}
          productId={product.id}
          averageRating={reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0}
          totalReviews={reviews.length}
          onReviewAdded={() => {
            // Re-fetch reviews after submission
            fetch(`${BACKEND_URL}/api/reviews/?product=${product.id}`)
              .then(res => res.json())
              .then(setReviews);
          }}
        />

        {/* Related Products */}
        <div className="space-y-12">
          <RelatedProducts 
            title={product.artisan ? `Autres produits de ${product.artisan.name}` : 'Autres produits'}
            products={artisanProducts}
            onProductClick={handleProductClick}
          />
          <RelatedProducts 
            title="Produits similaires"
            products={relatedProducts}
            onProductClick={handleProductClick}
          />
        </div>
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default ProductDetail;
