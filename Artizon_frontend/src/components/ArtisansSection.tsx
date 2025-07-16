
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const artisans = [
  { id: 1, name: 'Marie Kamga', city: 'Bafoussam', specialty: 'Bijoux', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face' },
  { id: 2, name: 'Pierre Nkounji', city: 'Dschang', specialty: 'Sculpture', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face' },
  { id: 3, name: 'Fatou Mballa', city: 'Mbouda', specialty: 'Textile', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=150&h=150&fit=crop&crop=face' },
  { id: 4, name: 'Jean Fotso', city: 'Bandjoun', specialty: 'Céramique', image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=150&h=150&fit=crop&crop=face' },
];

export const ArtisansSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Featured Artisans */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-6">
              Artisans à la Une
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rencontrez les talents exceptionnels qui donnent vie à nos créations
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {artisans.map((artisan) => (
                <Card key={artisan.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4 text-center">
                    <img 
                      src={artisan.image} 
                      alt={artisan.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="font-semibold text-gray-800">{artisan.name}</h3>
                    <p className="text-sm text-gray-600">{artisan.city}</p>
                    <Badge className="mt-2 bg-orange-100 text-orange-800">{artisan.specialty}</Badge>
                    <Button size="sm" variant="outline" className="mt-3 w-full border-[#405B35] text-[#405B35]">
                      Voir Profil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              Découvrir nos artisans créateurs
            </Button>
          </div>

          {/* Right: Interactive Map */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-[#405B35] mb-6">
              Trouvez un artisan près de chez vous
            </h3>
            
            {/* Stylized map of Ouest Cameroon region */}
            <div className="relative bg-green-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Map outline - simplified shape representing Ouest region */}
                <svg viewBox="0 0 200 150" className="w-full h-auto">
                  <path 
                    d="M20,50 Q40,20 80,30 Q120,25 160,40 Q180,60 170,90 Q160,120 140,130 Q100,140 60,135 Q30,125 20,100 Z" 
                    fill="#405B35" 
                    fillOpacity="0.3" 
                    stroke="#405B35" 
                    strokeWidth="2"
                  />
                  {/* Artisan location points */}
                  <circle cx="60" cy="70" r="8" fill="orange" className="cursor-pointer hover:scale-125 transition-transform" />
                  <circle cx="100" cy="60" r="8" fill="orange" className="cursor-pointer hover:scale-125 transition-transform" />
                  <circle cx="130" cy="85" r="8" fill="orange" className="cursor-pointer hover:scale-125 transition-transform" />
                  <circle cx="80" cy="100" r="8" fill="orange" className="cursor-pointer hover:scale-125 transition-transform" />
                </svg>
                
                {/* Location labels */}
                <div className="absolute top-8 left-8 text-xs font-semibold text-[#405B35]">Bafoussam</div>
                <div className="absolute top-12 right-12 text-xs font-semibold text-[#405B35]">Dschang</div>
                <div className="absolute bottom-16 left-16 text-xs font-semibold text-[#405B35]">Mbouda</div>
                <div className="absolute bottom-8 right-20 text-xs font-semibold text-[#405B35]">Bandjoun</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
