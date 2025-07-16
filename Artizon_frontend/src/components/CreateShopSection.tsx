
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, Sparkles } from 'lucide-react';

export const CreateShopSection = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const handleCreateShop = () => {
    setIsClicked(true);
    setTimeout(() => {
      navigate('/artisan/create');
      setIsClicked(false);
    }, 200);
  };

  return (
    <section className="py-16 px-4 relative">
      <div className="container mx-auto">
        {/* Single Background Container */}
        <div 
          className="relative rounded-2xl overflow-hidden p-12 text-center min-h-[500px] flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(64, 91, 53, 0.8), rgba(64, 91, 53, 0.8)), url(/lovable-uploads/9b756809-c663-40ab-90f7-8a995e913ce3.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="max-w-4xl mx-auto text-white relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full animate-pulse">
                <Store className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Créez votre boutique Artizone
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Vous êtes artisan ? Rejoignez notre communauté et partagez vos créations avec le monde entier. 
              Créez votre boutique en ligne, gérez vos produits et développez votre activité avec Artizone.
            </p>
            
            {/* Encart spécial artisan */}
            <div className="bg-white/90 text-gray-800 rounded-lg p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-[#405B35]">
                🎨 Vous êtes artisan ? Et vous voulez une boutique ?
              </h3>
              <p className="mb-4">
                Envoyer la demande et gérez votre boutique sur mobile
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm">📱 QR Code pour mobile</span>
                <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-xs">
                  QR
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleCreateShop}
                className={`bg-white text-[#405B35] hover:bg-gray-100 px-8 py-4 text-lg font-semibold transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  isClicked ? 'scale-95 bg-gray-200' : ''
                }`}
              >
                <Sparkles className="h-5 w-5" />
                Ouvrir ma boutique Artizone
              </Button>
              <div className="flex items-center gap-2 text-green-200 animate-pulse">
                <Sparkles className="h-4 w-4" />
                <span>Gratuit pendant 1 mois</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
