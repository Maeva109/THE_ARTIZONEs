
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star } from 'lucide-react';
import { artisanAPI, BACKEND_URL } from '@/lib/api';

const specialties = [
  'Toutes les spécialités',
  'Poterie',
  'Sculpture',
  'Tissage',
  'Vannerie',
  'Bijouterie',
  'Maroquinerie',
];
const regions = [
  'Toutes les régions',
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
  'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest',
];

export const ArtisansGrid = () => {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Toutes les spécialités');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');

  const fetchArtisans = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, string> = {};
      if (search) filters.nom = search;
      if (selectedRegion !== 'Toutes les régions') filters.region = selectedRegion;
      if (selectedSpecialty !== 'Toutes les spécialités') filters.specialty = selectedSpecialty;
      const data = await artisanAPI.listValidatedArtisansWithFilters(filters);
      setArtisans(data);
    } catch (e) {
      setError("Erreur lors du chargement des artisans.");
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
    // eslint-disable-next-line
  }, [search, selectedSpecialty, selectedRegion]);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#405B35] mb-4 text-center">
            Tous nos artisans créateurs
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Découvrez les talents exceptionnels de nos artisans camerounais et leurs créations uniques
          </p>

          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher un artisan, une spécialité..."
                className="pl-10 py-3"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#405B35] focus:border-transparent"
                value={selectedSpecialty}
                onChange={e => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#405B35] focus:border-transparent"
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
              >
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Artisans grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-gray-500">Chargement...</div>
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">{error}</div>
          ) : artisans.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">Aucun artisan trouvé.</div>
          ) : artisans.map((artisan) => (
            <Card key={artisan.id} className="hover:shadow-lg transition-shadow duration-300 group">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative mb-4">
                    <img
                      src={artisan.photo_profil
                        ? (artisan.photo_profil.startsWith('http')
                            ? artisan.photo_profil
                            : `${BACKEND_URL}${artisan.photo_profil}`)
                        : '/default-profile.png'}
                      alt={artisan.user?.prenom + ' ' + artisan.user?.nom}
                      onError={e => { e.currentTarget.src = '/default-profile.png'; }}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#405B35] mb-1">{artisan.user?.prenom} {artisan.user?.nom}</h3>
                  <p className="text-lg font-medium text-gray-700 mb-2">{artisan.boutique_id}</p>
                  <p className="text-gray-600 mb-3">{artisan.description_artisan?.slice(0, 40)}...</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{artisan.ville}, {artisan.region}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{artisan.rating ?? 'N/A'}</span>
                    </div>
                    <span className="text-sm text-gray-500">({artisan.review_count ?? 0} avis)</span>
                  </div>
                  <Button 
                    className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white"
                    asChild
                  >
                    <a href={`/artisan/${artisan.boutique_id?.toLowerCase().replace(/\s+/g, '-') || artisan.id || 'profile'}`}>
                      Voir la boutique
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load more button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white px-8 py-3"
          >
            Voir plus d'artisans
          </Button>
        </div>
      </div>
    </section>
  );
};
