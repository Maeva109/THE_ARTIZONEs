
import { useEffect, useState } from 'react';
import { Sparkles, Heart, Users } from 'lucide-react';
import { artisanAPI, BACKEND_URL } from '@/lib/api';

export const ArtisansHeroBanner = () => {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        const data = await artisanAPI.listValidatedArtisans();
        setArtisans(data.slice(0, 6));
      } catch (e) {
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-orange-200 opacity-50">
        <Sparkles className="h-20 w-20 animate-pulse" />
      </div>
      <div className="absolute top-20 right-20 text-[#405B35] opacity-30">
        <Heart className="h-16 w-16 animate-pulse" />
      </div>
      <div className="container mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Users className="h-10 w-10 text-[#405B35]" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#405B35]">
            Découvrir nos artisans créateurs
          </h1>
          <Sparkles className="h-10 w-10 text-orange-500 animate-pulse" />
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-[#405B35] to-orange-500 mx-auto mb-8 rounded-full"></div>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Rencontrez les artistes passionnés qui donnent vie à chaque création. 
          Découvrez leurs histoires, leurs techniques et laissez-vous inspirer par leur talent unique.
        </p>
        {/* Responsive grid of artisan circles */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 justify-items-center max-w-5xl mx-auto">
            {loading ? (
              <div className="text-gray-500 col-span-full">Chargement...</div>
            ) : artisans.length === 0 ? (
              <div className="text-gray-500 col-span-full">Aucun artisan trouvé.</div>
            ) : artisans.map((artisan) => (
              <div
                key={artisan.id}
                className="text-center cursor-pointer group"
              >
                <div className="relative mb-3">
                  <img
                    src={artisan.photo_profil
                      ? (artisan.photo_profil.startsWith('http')
                          ? artisan.photo_profil
                          : `${BACKEND_URL}${artisan.photo_profil}`)
                      : '/default-profile.png'}
                    alt={artisan.user?.prenom + ' ' + artisan.user?.nom}
                    onError={e => { e.currentTarget.src = '/default-profile.png'; }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-all duration-300 group-hover:border-orange-300"
                  />
                  <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-3 w-3" />
                  </div>
                </div>
                <a
                  href={`/artisan/${artisan.boutique_id?.toLowerCase().replace(/\s+/g, '-') || artisan.id || 'profile'}`}
                  className="block text-sm md:text-base font-medium text-[#405B35] hover:text-orange-500 transition-colors min-w-0 max-w-24 group-hover:scale-105 transform duration-200"
                >
                  {artisan.boutique_id || artisan.user?.prenom}
                </a>
              </div>
            ))}
          </div>
          {/* Gradient fade on sides (optional, can be removed for grid) */}
        </div>
      </div>
    </section>
  );
};
