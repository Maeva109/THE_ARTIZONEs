
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  QrCode, 
  ExternalLink,
  Facebook,
  Instagram,
  MessageCircle,
  Filter,
  Grid,
  List,
  Loader2
} from 'lucide-react';
import { artisanAPI, BACKEND_URL, productAPI, reviewAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface ArtisanData {
  id: number;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  boutique_id: string;
  description_artisan: string;
  ville: string;
  region: string;
  photo_profil: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  opening_hours: string;
  galerie: string[];
  profil_complet: boolean;
  statut: string;
  qr_code: string;
}

const ArtisanProfile = () => {
  const { shopName } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [artisan, setArtisan] = useState<ArtisanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuth();
  const isOwnProfile = isAuthenticated && user?.role === 'artisan' && user.id === artisan?.user?.id;

  const categories = ['all', 'Sculpture', 'Bijoux', 'Décoration'];
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Fetch artisan data from backend
  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!shopName) {
          setError('Nom de boutique manquant');
          return;
        }
        
        // Try to get artisan by shop name first
        const artisanData = await artisanAPI.getArtisanByShop(shopName);
        setArtisan(artisanData);
        
      } catch (err: any) {
        console.error('Error fetching artisan data:', err);
        
        // If artisan not found by shop name, try to get by ID as fallback
        if (err.message?.includes('404') || err.message?.includes('non trouvé')) {
          try {
            // Try to extract artisan ID from localStorage or use fallback
            const artisanId = localStorage.getItem('artisan_id') || '1';
            const artisanData = await artisanAPI.getProfile(artisanId);
            setArtisan(artisanData);
            return;
          } catch (fallbackErr) {
            console.error('Fallback fetch also failed:', fallbackErr);
          }
        }
        
        setError('Erreur lors du chargement du profil artisan');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le profil de l'artisan"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanData();
  }, [shopName, toast]);

  // Fetch products and reviews for the artisan
  useEffect(() => {
    if (artisan) {
      productAPI.getProducts({ artisan: String(artisan.id) }).then(setProducts);
      reviewAPI.getReviewsByArtisan(String(artisan.id)).then(setReviews);
    }
  }, [artisan]);

  const generateQRCode = () => {
    if (artisan?.qr_code) {
      return `${BACKEND_URL}${artisan.qr_code}`;
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://artizone.com/artisan/${shopName}`)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#405B35]" />
                <p className="text-gray-600">Chargement du profil artisan...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil non trouvé</h2>
              <p className="text-gray-600 mb-6">
                {error || "L'artisan que vous recherchez n'existe pas ou n'est plus disponible."}
              </p>
              <Button onClick={() => window.history.back()} className="bg-[#405B35] hover:bg-[#405B35]/90">
                Retour
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format artisan data for display
  const displayData = {
    name: `${artisan.user.prenom} ${artisan.user.nom}`,
    shopName: artisan.boutique_id || 'Boutique Artisan',
    profilePhoto: artisan.photo_profil ? (artisan.photo_profil.startsWith('http') ? artisan.photo_profil : `${BACKEND_URL}${artisan.photo_profil}`) : '/default-profile.png',
    city: artisan.ville || 'Ville non spécifiée',
    region: artisan.region || 'Région non spécifiée',
    description: artisan.description_artisan || 'Aucune description disponible.',
    rating: 4.8, // This would come from reviews API
    reviewCount: reviews.length,
    phone: artisan.user.telephone || 'Non renseigné',
    email: artisan.user.email,
    socialMedia: {
      facebook: artisan.facebook || '',
      instagram: artisan.instagram || '',
      whatsapp: artisan.whatsapp || ''
    },
    openingHours: artisan.opening_hours || 'Horaires non renseignés',
    gallery: artisan.galerie ? artisan.galerie.map(img => `${BACKEND_URL}${img}`) : [],
    specialties: ['Artisanat', 'Création unique'] // This could be dynamic based on products
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/artisans">Nos artisans</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{displayData.shopName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Banner Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <img
                      src={displayData.profilePhoto}
                      alt={displayData.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#405B35]"
                      onError={(e) => {
                        e.currentTarget.src = '/default-profile.png';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-[#405B35] mb-2">
                        {displayData.shopName}
                      </h1>
                      <p className="text-xl text-gray-700 mb-2">par {displayData.name}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{displayData.city}, {displayData.region}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{displayData.rating}</span>
                          <span className="text-gray-500">({displayData.reviewCount} avis)</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {displayData.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {displayData.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="bg-[#405B35]/10 text-[#405B35]">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Edit Profile Button */}
                  {/*
                  <div className="mt-4 text-right">
                    <Button
                      className="bg-[#405B35] hover:bg-[#405B35]/90"
                      asChild
                    >
                      <a href={`/artisan/profile-completion?artisan_id=${artisan?.id}&edit=1`}>
                        Modifier mon profil
                      </a>
                    </Button>
                  </div>
                  */}
                </div>

                {/* Contact & QR */}
                <div className="flex flex-col gap-4 items-center">
                  {displayData.socialMedia.whatsapp ? (
                    <a
                      href={`https://wa.me/${displayData.socialMedia.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-[#405B35] hover:bg-[#405B35]/90 px-6">
                        <Mail className="h-4 w-4 mr-2" />
                        Contacter l'artisan
                      </Button>
                    </a>
                  ) : (
                    <Button className="bg-[#405B35] px-6" disabled>
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter l'artisan
                    </Button>
                  )}
                  {isOwnProfile && (
                    <div className="text-center">
                      <img
                        src={generateQRCode()}
                        alt="QR Code"
                        className="w-24 h-24 mx-auto mb-2"
                      />
                      <p className="text-xs text-gray-500">Accès mobile</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">À propos</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
              <TabsTrigger value="location">Localisation</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#405B35] mb-4">Description</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {displayData.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-[#405B35]" />
                        <span>{displayData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-[#405B35]" />
                        <span>{displayData.email}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-[#405B35] mt-1" />
                        <div className="whitespace-pre-line text-sm">
                          {displayData.openingHours}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      {displayData.socialMedia.facebook && (
                        <a href={displayData.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Facebook className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {displayData.socialMedia.instagram && (
                        <a href={displayData.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Instagram className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {displayData.socialMedia.whatsapp && (
                        <a href={`https://wa.me/${displayData.socialMedia.whatsapp}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-[#405B35] mb-4">Galerie</h3>
                    {artisan.galerie && artisan.galerie.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {artisan.galerie.map((img, index) => (
                          <img
                            key={index}
                            src={img.startsWith('http') ? img : `${BACKEND_URL}/media/${img}`}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <p>Aucune photo dans la galerie</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:border-[#405B35] focus:ring-[#405B35]"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className={`${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'} object-cover rounded-lg mb-4`}
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">{product.name}</h4>
                          <p className="text-2xl font-bold text-[#405B35] mb-2">
                            {product.price.toLocaleString()} FCFA
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                            <Badge variant={product.inStock ? "default" : "secondary"}>
                              {product.inStock ? 'En stock' : 'Rupture'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#405B35]">
                  Avis clients ({reviews.length})
                </h3>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold">{displayData.rating}</span>
                  <span className="text-gray-500">/ 5</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{review.customerName}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{review.date}</p>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs mt-1">Achat vérifié</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-[#405B35] mb-4">Localisation</h3>
                  
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Carte de localisation</p>
                      <p className="text-sm">{displayData.city}, {displayData.region}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#405B35]" />
                    <span className="font-medium">{displayData.city}, Région de l'{displayData.region}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtisanProfile;
