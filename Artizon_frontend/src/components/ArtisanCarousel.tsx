
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, MapPin, Star, Users } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { artisanAPI, BACKEND_URL } from '@/lib/api';

interface Artisan {
  id: number;
  name: string;
  specialty: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  badge?: string;
  boutique_id?: number; // Added for profile link
}

export const ArtisanCarousel = () => {
  const { favorites, toggleFavorite, getTotalFavorites } = useFavorites();
  const { toast } = useToast();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      try {
        const data = await artisanAPI.listValidatedArtisans();
        // Map backend data to Artisan type
        const mapped = data.map((a: any) => ({
          id: a.id,
          name: `${a.user?.prenom || ''} ${a.user?.nom || ''}`.trim(),
          specialty: a.specialty || 'Artisan',
          location: a.ville || '',
          image: a.photo_profil
            ? (a.photo_profil.startsWith('http') ? a.photo_profil : `${BACKEND_URL}${a.photo_profil}`)
            : '/default-profile.png',
          rating: a.note_moyenne || 0,
          reviewCount: a.nombre_avis || 0,
          description: a.description_artisan || '',
          badge: a.badge || undefined,
          boutique_id: a.boutique_id, // Assuming boutique_id is available
        }));
        setArtisans(mapped);
      } catch (e) {
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  const handleFavoriteClick = (artisan: Artisan) => {
    const wasAdded = toggleFavorite(artisan.id, 'artisan');
    
    toast({
      title: wasAdded ? "Ajouté aux favoris ❤️" : "Retiré des favoris",
      description: wasAdded 
        ? `${artisan.name} a été ajouté à vos favoris`
        : `${artisan.name} a été retiré de vos favoris`
    });
  };

  const getBadgeColor = (badge: string | undefined) => {
    switch (badge) {
      case 'Certifiée':
        return 'bg-green-500';
      case 'Expert':
        return 'bg-blue-500';
      case 'Authentique':
        return 'bg-orange-500';
      case 'Éco-responsable':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section className="pt-8 pb-24 px-4 bg-gradient-to-b from-[#405B35]/5 to-white overflow-visible">
      <div className="container mx-auto overflow-visible">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-4">
            Nos Artisans Passionnés
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les talents exceptionnels qui donnent vie à chaque création unique
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Heart className={`h-5 w-5 ${getTotalFavorites() > 0 ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
            <span className="text-sm text-gray-600">
              {getTotalFavorites()} artisan{getTotalFavorites() > 1 ? 's' : ''} en favoris
            </span>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full overflow-visible"
        >
          <CarouselContent className="-ml-2 md:-ml-4 overflow-visible">
            {loading ? (
              <div className="text-center text-gray-500 py-12">Chargement...</div>
            ) : artisans.length === 0 ? (
              <div className="text-center text-gray-500 py-12">Aucun artisan trouvé.</div>
            ) : artisans.map((artisan) => (
              <CarouselItem key={artisan.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 overflow-visible">
                <Card className="relative group overflow-visible bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#405B35] h-full mt-12" style={{ marginTop: '3rem' }}>
                  {/* Circular profile image overlapping card */}
                  <div className="flex flex-col items-center mb-2" style={{ marginTop: '-3rem' }}>
                    <div className="relative flex justify-center">
                      <img
                        src={artisan.image}
                        alt={artisan.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg z-10 bg-gray-100"
                      />
                      {/* Floating favorite button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -top-2 -right-2 bg-white/90 hover:bg-white z-20 shadow"
                        onClick={() => handleFavoriteClick(artisan)}
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.some(f => f.id === artisan.id && f.type === 'artisan') ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                      </Button>
                    </div>
                    {/* Badge for specialty/status */}
                    {artisan.badge && (
                      <Badge className={`mt-2 px-3 py-1 text-xs font-semibold ${getBadgeColor(artisan.badge)} text-white rounded-full`}>{artisan.badge}</Badge>
                    )}
                  </div>
                  <CardContent className="pt-2 pb-6 px-6 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-[#405B35] mb-1 line-clamp-1">{artisan.name}</h3>
                    <p className="text-orange-600 font-semibold mb-2 line-clamp-1">{artisan.specialty}</p>
                    {/* Location and rating row */}
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm line-clamp-1">{artisan.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{artisan.rating}</span>
                        <Users className="h-4 w-4 ml-2" />
                        <span className="text-sm">{artisan.reviewCount} avis</span>
                      </div>
                    </div>
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5em]">{artisan.description}</p>
                    {/* Voir le profil button */}
                    <a
                      href={artisan.boutique_id ? `/artisan/${String(artisan.boutique_id).toLowerCase()}` : `/artisan/${artisan.id || 'profile'}`}
                      className="w-full"
                    >
                      <Button className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white rounded-lg py-2 text-base font-semibold shadow">
                        Voir le profil
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Carousel indicators (dots) */}
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(artisans.length / 1) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
