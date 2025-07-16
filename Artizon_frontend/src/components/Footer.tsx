
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const Footer = () => {
  return (
    <footer className="bg-[#405B35] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Logo and description - Using image 2 logo */}
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start">
              <img 
                src="/lovable-uploads/b5fc6385-34ed-4a5a-a2d4-d8ae12702b43.png" 
                alt="Artizone Logo" 
                className="h-26 w-auto mb-4 transform hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="text-green-200 leading-relaxed">
              Artizone connecte les artisans talentueux du Cameroun avec des clients passionnés par l'art local. 
              Découvrez, apprenez et soutenez l'artisanat traditionnel camerounais.
            </p>
            
            {/* Mobile management info */}
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📱 Gestion Mobile & Synchronisation Web</h4>
              <p className="text-sm text-green-200">
                Gérez votre espace artisan depuis votre mobile. Synchronisation automatique avec la plateforme web.
              </p>
            </div>
          </div>

          {/* Center: Espace artisan form */}
          <div>
            <h3 className="text-xl font-bold mb-6">Espace Artisan</h3>
            <form className="space-y-4">
              <Input 
                placeholder="Votre nom complet" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Input 
                placeholder="Votre numéro de téléphone" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Input 
                placeholder="Votre email" 
                type="email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Input 
                placeholder="Votre département" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Textarea 
                placeholder="Votre message"
                rows={3}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Envoyer
              </Button>
            </form>
          </div>

          {/* Right: Quick links and social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Catalogue</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Artisans</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Tutoriels</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Réseaux sociaux</h3>
              <div className="flex gap-4">
                <a href="#" className="text-green-200 hover:text-white transition-colors">📘 Facebook</a>
                <a href="#" className="text-green-200 hover:text-white transition-colors">📷 Instagram</a>
                <a href="#" className="text-green-200 hover:text-white transition-colors">🐦 Twitter</a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Mentions légales</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-green-200 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-green-200">
          <p>&copy; 2025 Artizone. Tous droits réservés. Plateforme dédiée à l'artisanat camerounais.</p>
        </div>
      </div>
    </footer>
  );
};
