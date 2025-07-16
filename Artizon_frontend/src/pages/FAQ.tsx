
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'Comment passer une commande sur Artizone ?',
      answer: 'Pour passer une commande, parcourez notre catalogue, ajoutez les produits souhaités à votre panier, puis cliquez sur "Commander". Suivez ensuite les étapes de paiement sécurisé.',
      category: 'Commandes'
    },
    {
      id: '2',
      question: 'Quels sont les modes de paiement acceptés ?',
      answer: 'Nous acceptons les paiements par Mobile Money (MTN, Orange), Visa, Mastercard et virement bancaire. Tous les paiements sont sécurisés.',
      category: 'Paiements'
    },
    {
      id: '3',
      question: 'Quels sont les délais de livraison ?',
      answer: 'Les délais de livraison varient selon votre localisation : 2-3 jours pour Douala/Yaoundé, 3-5 jours pour les autres villes du Cameroun, 7-14 jours pour l\'international.',
      category: 'Livraison'
    },
    {
      id: '4',
      question: 'Comment devenir artisan partenaire ?',
      answer: 'Pour devenir artisan partenaire, remplissez le formulaire dans l\'espace artisan sur notre site. Notre équipe étudiera votre candidature et vous contactera sous 48h.',
      category: 'Compte Artisan'
    },
    {
      id: '5',
      question: 'Puis-je retourner un produit ?',
      answer: 'Oui, vous avez 14 jours pour retourner un produit non personnalisé. Le produit doit être dans son état d\'origine. Les frais de retour sont à votre charge sauf en cas de défaut.',
      category: 'Retours'
    },
    {
      id: '6',
      question: 'Comment suivre ma commande ?',
      answer: 'Après validation de votre commande, vous recevrez un email avec un numéro de suivi. Vous pouvez également suivre votre commande dans votre espace client.',
      category: 'Commandes'
    },
    {
      id: '7',
      question: 'Les produits sont-ils authentiques ?',
      answer: 'Tous nos produits sont créés par des artisans vérifiés et authentifiés. Chaque produit est accompagné d\'un certificat d\'authenticité.',
      category: 'Produits'
    },
    {
      id: '8',
      question: 'Comment contacter un artisan directement ?',
      answer: 'Vous pouvez contacter un artisan via sa page profil ou en utilisant le système de messagerie intégré sur la page du produit.',
      category: 'Compte Artisan'
    },
    {
      id: '9',
      question: 'Y a-t-il des frais de livraison ?',
      answer: 'Les frais de livraison varient selon la destination : gratuit à partir de 50 000 FCFA au Cameroun, tarifs préférentiels pour l\'international.',
      category: 'Livraison'
    },
    {
      id: '10',
      question: 'Comment modifier ou annuler ma commande ?',
      answer: 'Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation, via votre espace client ou en nous contactant directement.',
      category: 'Commandes'
    }
  ];

  const categories = ['all', ...Array.from(new Set(faqData.map(faq => faq.category)))];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#EDF0E0]">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200 mt-20 px-4 py-3">
        <div className="container mx-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-[#405B35] transition-colors">
                  Accueil
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="hover:text-[#405B35] transition-colors">
                  À propos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#405B35] font-medium">
                  FAQ
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#405B35] mb-6">
              Questions fréquentes
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Trouvez les réponses à vos questions
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg rounded-lg border-gray-300 focus:border-[#405B35] focus:ring-[#405B35]"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-[#405B35] hover:bg-[#405B35]/90 text-white" 
                    : "border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white"
                  }
                >
                  {category === 'all' ? 'Toutes' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <Card className="shadow-lg mb-12">
            <CardContent className="p-6">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left hover:text-[#405B35] transition-colors">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600">
                    Aucune question ne correspond à votre recherche.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                    className="mt-4 border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="text-center shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#405B35] mb-4">
                Votre question n'est pas ici ?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Notre équipe support est là pour vous aider. N'hésitez pas à nous contacter !
              </p>
              <Button asChild className="bg-[#405B35] hover:bg-[#405B35]/90 text-white px-8 py-3 text-lg">
                <Link to="/contact">
                  Nous contacter
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default FAQ;
