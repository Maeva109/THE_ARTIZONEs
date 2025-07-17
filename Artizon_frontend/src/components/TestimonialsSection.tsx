
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: 'Sophie Durand',
    date: '15 Mars 2024',
    rating: 5,
    text: 'Magnifique collier traditionnel ! La qualité est exceptionnelle et l\'artisan a su capturer l\'essence de l\'art camerounais.',
    productImage: '/lovable-uploads/ndop.jpg',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Michel Kouam',
    date: '8 Mars 2024',
    rating: 5,
    text: 'Service client excellent et livraison rapide. Je recommande vivement cette plateforme pour découvrir l\'artisanat local.',
    productImage: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=100&h=100&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Aminata Sow',
    date: '2 Mars 2024',
    rating: 5,
    text: 'Les produits sont authentiques et de grande qualité. C\'est formidable de pouvoir soutenir les artisans locaux.',
    productImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Jean-Pierre Mballa',
    date: '25 Février 2024',
    rating: 5,
    text: 'Une plateforme exceptionnelle qui valorise nos artisans. Les créations sont uniques et pleines d\'histoire.',
    productImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=50&h=50&fit=crop&crop=face'
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#405B35] mb-4">
            Témoignages / Avis clients & artisans
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les expériences de ceux qui ont choisi Artizone
          </p>
        </div>

        {/* Circular testimonials layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-200 rounded-full p-1 bg-gradient-to-br from-orange-100 to-green-100">
              <div className="bg-white rounded-full p-6 h-full flex flex-col justify-center items-center text-center">
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <img 
                    src={testimonial.productImage} 
                    alt="Product"
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                  />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{testimonial.name}</h4>
                <div className="flex justify-center mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-orange-400">⭐</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic mb-2">"{testimonial.text}"</p>
                <span className="text-xs text-gray-500">{testimonial.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
