import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export const Footer = () => {
  const [footerForm, setFooterForm] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    message: ''
  });
  const [footerSubmitting, setFooterSubmitting] = useState(false);

  const handleFooterInput = (field: string, value: string) => {
    setFooterForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: footerForm.name,
          email: footerForm.email,
          message: footerForm.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Message envoyé !');
        setFooterForm({ name: '', phone: '', email: '', department: '', message: '' });
      } else {
        alert(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi');
    } finally {
      setFooterSubmitting(false);
    }
  };

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
            <form className="space-y-4" onSubmit={handleFooterSubmit}>
              <Input 
                placeholder="Votre nom complet" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                value={footerForm.name}
                onChange={e => handleFooterInput('name', e.target.value)}
              />
              <Input 
                placeholder="Votre numéro de téléphone" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                value={footerForm.phone}
                onChange={e => handleFooterInput('phone', e.target.value)}
              />
              <Input 
                placeholder="Votre email" 
                type="email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                value={footerForm.email}
                onChange={e => handleFooterInput('email', e.target.value)}
              />
              <Input 
                placeholder="Votre département" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                value={footerForm.department}
                onChange={e => handleFooterInput('department', e.target.value)}
              />
              <Textarea 
                placeholder="Votre message"
                rows={3}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                value={footerForm.message}
                onChange={e => handleFooterInput('message', e.target.value)}
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" type="submit" disabled={footerSubmitting}>
                {footerSubmitting ? 'Envoi en cours...' : 'Envoyer'}
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
