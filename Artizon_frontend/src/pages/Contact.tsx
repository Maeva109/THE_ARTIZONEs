import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    { value: 'question', label: 'Question générale' },
    { value: 'probleme', label: 'Problème technique' },
    { value: 'partenariat', label: 'Partenariat' },
    { value: 'artisan', label: 'Devenir artisan' },
    { value: 'autre', label: 'Autre' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.subject) {
      newErrors.subject = 'Veuillez sélectionner un sujet';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setErrors({});
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF0E0]">
      <Header />
      
      <main className="pt-24 pb-16 px-2 sm:px-4">
        <div className="container mx-auto px-2 sm:px-4 max-w-4xl">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#405B35] mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une question, un problème ou une suggestion ? Nous sommes là pour vous aider.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#405B35]">
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                      Nom complet *
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full ${errors.fullName ? 'border-orange-500' : ''}`}
                      placeholder="Votre nom complet"
                    />
                    {errors.fullName && (
                      <p className="text-orange-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full ${errors.email ? 'border-orange-500' : ''}`}
                      placeholder="votre.email@exemple.com"
                    />
                    {errors.email && (
                      <p className="text-orange-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Téléphone (optionnel)
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Sujet *
                    </label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger className={`w-full ${errors.subject ? 'border-orange-500' : ''}`}>
                        <SelectValue placeholder="Sélectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-orange-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`w-full ${errors.message ? 'border-orange-500' : ''}`}
                      placeholder="Décrivez votre demande en détail..."
                      rows={6}
                    />
                    {errors.message && (
                      <p className="text-orange-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#405B35] hover:bg-[#405B35]/90 text-white py-3"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#405B35]">
                    Informations de Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#405B35] p-3 rounded-full">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email Support</h3>
                      <p className="text-gray-600">artizonekay@gmail.com</p>
                      <p className="text-gray-600">varbafoussam@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-[#405B35] p-3 rounded-full">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Téléphone</h3>
                      <p className="text-gray-600">+237 695263365/675647869</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500 p-3 rounded-full">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Réseaux Sociaux</h3>
                      <div className="flex gap-3 mt-2">
                        <a href="https://www.facebook.com/profile.php?id=100064729103106&locale=fr_FR" className="text-[#405B35] hover:text-orange-500">Facebook</a>
                        <a href="#" className="text-[#405B35] hover:text-orange-500">Instagram</a>
                        <a href="#" className="text-[#405B35] hover:text-orange-500">Twitter</a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-[#405B35] flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Aide Rapide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <a href="#" className="block text-[#405B35] hover:text-orange-500 transition-colors">
                      → Comment passer une commande ?
                    </a>
                    <a href="#" className="block text-[#405B35] hover:text-orange-500 transition-colors">
                      → Problème de paiement
                    </a>
                    <a href="#" className="block text-[#405B35] hover:text-orange-500 transition-colors">
                      → Suivi de commande
                    </a>
                    <a href="#" className="block text-[#405B35] hover:text-orange-500 transition-colors">
                      → Devenir artisan partenaire
                    </a>
                    <a href="#" className="block text-[#405B35] hover:text-orange-500 transition-colors">
                      → FAQ complète
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Contact;
