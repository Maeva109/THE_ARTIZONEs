
import { Card, CardContent } from '@/components/ui/card';
import { Compass, ShoppingCart, Truck } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Parcourez le catalogue',
    description: 'Explorez notre vaste collection de produits artisanaux authentiques',
    icon: Compass,
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    id: 2,
    title: 'Commandez en ligne',
    description: 'Passez votre commande en toute sécurité avec notre système de paiement fiable',
    icon: ShoppingCart,
    color: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 3,
    title: 'Recevez votre produit',
    description: 'Recevez votre commande directement chez vous avec notre service de livraison',
    icon: Truck,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-emerald-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-teal-200/40 rounded-full blur-lg"></div>
      
      <div className="container mx-auto relative">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="h-8 w-8 text-emerald-600" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Comment ça marche ?
            </h2>
            <ShoppingCart className="h-8 w-8 text-teal-600" />
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Trois étapes simples pour découvrir et acquérir des œuvres artisanales uniques
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className="hover:shadow-xl transition-all duration-300 h-full bg-white/80 backdrop-blur-sm border-white/50 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110`}>
                    <step.icon className={`h-10 w-10 ${step.iconColor}`} />
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-lg">
                    {step.id}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-3xl text-emerald-300 animate-pulse">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
