
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, Users, ArrowRight, Lightbulb } from 'lucide-react';

const tutorials = [
  {
    id: 1,
    title: 'Initiation à la Poterie',
    description: 'Apprenez les bases de la poterie traditionnelle camerounaise',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    duration: '2h 30min',
    level: 'Débutant',
    students: 156,
    category: 'Poterie'
  },
  {
    id: 2,
    title: 'Tissage Traditionnel',
    description: 'Maîtrisez l\'art du tissage avec des techniques ancestrales',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop',
    duration: '3h 15min',
    level: 'Intermédiaire',
    students: 89,
    category: 'Textile'
  },
  {
    id: 3,
    title: 'Sculpture sur Bois',
    description: 'Créez vos premières sculptures en bois d\'ébène',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop',
    duration: '4h 00min',
    level: 'Avancé',
    students: 67,
    category: 'Sculpture'
  },
  {
    id: 4,
    title: 'Bijouterie Artisanale',
    description: 'Concevez et réalisez vos propres bijoux authentiques',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
    duration: '2h 45min',
    level: 'Débutant',
    students: 234,
    category: 'Bijoux'
  }
];

export const TutorialsSection = () => {
  const navigate = useNavigate();
  const [isViewAllClicked, setIsViewAllClicked] = useState(false);

  const handleViewAllTutorials = () => {
    setIsViewAllClicked(true);
    setTimeout(() => {
      navigate('/tutoriels');
      setIsViewAllClicked(false);
    }, 200);
  };

  const handleStartTutorial = (tutorialId: number) => {
    // Redirection vers la page du tutoriel ou ouverture de la vidéo
    navigate(`/tutoriel/${tutorialId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-500';
      case 'Intermédiaire': return 'bg-orange-500';
      case 'Avancé': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200/40 rounded-full blur-lg"></div>
      
      <div className="container mx-auto relative">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="h-8 w-8 text-indigo-600" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Formations & Tutoriels
            </h2>
            <Lightbulb className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Développez vos compétences artisanales avec nos formations complètes et nos tutoriels experts
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95 bg-white/80 backdrop-blur-sm border-white/50">
              <div className="relative">
                <img 
                  src={tutorial.image} 
                  alt={tutorial.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={() => handleStartTutorial(tutorial.id)}
                    className="bg-white/90 text-indigo-600 hover:bg-white hover:scale-110 transition-all duration-200"
                    size="sm"
                  >
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Démarrer
                  </Button>
                </div>
                <Badge className={`absolute top-2 right-2 ${getLevelColor(tutorial.level)}`}>
                  {tutorial.level}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{tutorial.students}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleStartTutorial(tutorial.id)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                >
                  Commencer le cours
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleViewAllTutorials}
            className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto shadow-lg ${
              isViewAllClicked ? 'scale-95 opacity-80' : ''
            }`}
          >
            Voir toutes les formations
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
