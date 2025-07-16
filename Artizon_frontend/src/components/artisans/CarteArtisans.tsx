import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Artisan {
  id: number;
  nom: string;
  departement: string;
  latitude: number;
  longitude: number;
  specialty: string;
}

const departements = [
  'Tous',
  'Bamboutos', 'Hauts-Plateaux', 'Haut-Nkam', 'Haut-Plateau', 'Koung-Khi',
  'Mifi', 'Menoua', 'Nde', 'Noun'
];

export default function CarteArtisans() {
  const [selectedDept, setSelectedDept] = useState('Tous');
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch artisans from API (adapt URL as needed)
    fetch('http://localhost:8000/api/artisans/?region=Ouest')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des artisans');
        return res.json();
      })
      .then(data => {
        // Adapt to your API response structure
        setArtisans(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredArtisans = selectedDept === 'Tous'
    ? artisans
    : artisans.filter(a => a.departement === selectedDept);

  return (
    <section className="py-8 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-[#405B35] mb-4 text-center">
          Carte des artisans de l'Ouest Cameroun
        </h2>
        <div className="mb-4 flex gap-2 items-center justify-center">
          <label htmlFor="departement" className="font-semibold">Département :</label>
          <select
            id="departement"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="border rounded px-2 py-1 focus:ring-2 focus:ring-[#405B35]"
          >
            {departements.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <MapContainer center={[5.5, 10.5]} zoom={8} style={{ height: '400px', width: '100%' }} aria-label="Carte des artisans">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredArtisans.map(artisan => (
              <Marker key={artisan.id} position={[artisan.latitude, artisan.longitude]}>
                <Popup>
                  <strong>{artisan.nom}</strong><br />
                  {artisan.specialty}<br />
                  {artisan.departement}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </section>
  );
} 