
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { Button } from '@/components/ui/button';
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
import { Heart, Users, Shield, Star, Globe, Handshake } from 'lucide-react';

const QuiSommesNous = () => {
  const values = [
    {
      icon: Heart,
      title: "Authenticité",
      description: "Nous valorisons les créations artisanales authentiques et traditionnelles du Cameroun."
    },
    {
      icon: Star,
      title: "Qualité",
      description: "Chaque produit est sélectionné selon nos standards de qualité les plus élevés."
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Nous créons des liens durables entre artisans et clients passionnés."
    },
    {
      icon: Shield,
      title: "Transparence",
      description: "Nous garantissons une transparence totale sur l'origine et la fabrication de nos produits."
    },
    {
      icon: Globe,
      title: "Éthique",
      description: "Nous soutenons un commerce équitable et respectueux de l'environnement."
    },
    {
      icon: Handshake,
      title: "Partenariat",
      description: "Nous accompagnons nos artisans dans leur développement professionnel."
    }
  ];

  const teamMembers = [
    {
      name: "M. Nana Eddy Merlin",
      role: "Coordonateur du village Artisanal",
      image: "/lovable-uploads/co.jpg",
      quote: "Ma passion pour l'artisanat camerounais m'a menée à créer Artizone."
    },
    {
      name: "M. Chouibou",
      role: "Chef Section Formation",
      image: "/lovable-uploads/mch.jpg",
      quote: "Nous utilisons la technologie pour valoriser notre patrimoine culturel."
    },
    {
      name: "Fatima Bello",
      role: "Responsable Artisans",
      image: "/lovable-uploads/valo.jpg",
      quote: "Chaque artisan a une histoire unique à partager avec le monde."
    }
  ];

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
                  Qui sommes-nous
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      <main className="py-16 pt-24 md:pt-32">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#405B35] mb-6">
              Qui sommes-nous ?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre histoire et nos valeurs qui nous animent chaque jour
            </p>
          </div>

          {/* Section 1: Notre Mission */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-6">
                  Notre mission : Valoriser l'artisanat africain
                </h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    Artizone est née d'une passion profonde pour l'artisanat traditionnel camerounais 
                    et d'une vision : connecter les artisans talentueux de la région de l'Ouest 
                    avec des clients du monde entier qui apprécient l'authenticité et la qualité.
                  </p>
                  <p>
                    Notre plateforme permet aux artisans de présenter leurs créations uniques, 
                    de partager leur savoir-faire ancestral et de développer leur activité 
                    dans un environnement numérique moderne et sécurisé.
                  </p>
                  <p>
                    Nous croyons que chaque création artisanale raconte une histoire, 
                    porte en elle des siècles de tradition et mérite d'être valorisée 
                    à sa juste valeur sur le marché international.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/lovable-uploads/ko.jpg" 
                  alt="Artisan au travail"
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Nos Valeurs */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-4">
                Nos valeurs
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ces principes guident chacune de nos actions et décisions
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="bg-[#405B35] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#405B35] mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 3: Notre Équipe */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-4">
                Rencontrez notre équipe
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Des passionnés dévoués à la promotion de l'artisanat camerounais
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="pt-6">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-[#405B35] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-orange-500 font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 italic">
                      "{member.quote}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Section 4: Galerie / Témoignages */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-4">
                Notre impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez nos artisans et leurs créations exceptionnelles
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <img 
                src="/lovable-uploads/bi.jpg"
                alt="Bijoux artisanaux"
                className="rounded-lg shadow-md w-full h-48 object-cover hover:scale-105 transition-transform"
              />
              <img 
                src="/lovable-uploads/te.jpg"
                alt="Textile traditionnel"
                className="rounded-lg shadow-md w-full h-48 object-cover hover:scale-105 transition-transform"
              />
              <img 
                src="/lovable-uploads/sc.jpg"
                alt="Sculpture en bois"
                className="rounded-lg shadow-md w-full h-48 object-cover hover:scale-105 transition-transform"
              />
              <img 
                src="/lovable-uploads/de2.jpg"
                alt="Décoration artisanale"
                className="rounded-lg shadow-md w-full h-48 object-cover hover:scale-105 transition-transform"
              />
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-[#405B35] mb-4">
              Une question ? Contactez-nous !
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre équipe est là pour vous accompagner dans votre découverte 
              de l'artisanat camerounais.
            </p>
            <Button asChild className="bg-[#405B35] hover:bg-[#405B35]/90 text-white px-8 py-4 text-lg">
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default QuiSommesNous;
