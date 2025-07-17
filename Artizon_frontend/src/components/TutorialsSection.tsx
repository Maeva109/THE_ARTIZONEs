
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, Users, ArrowRight, Lightbulb } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const tutorials = [
  {
    id: 1,
    title: 'Initiation à la Poterie',
    description: 'Apprenez les bases de la poterie traditionnelle camerounaise',
    image: 'https://youtu.be/vo60czyD-P0?si=Eupfs9FTLjKtHJ-M',
    duration: '2h 30min',
    level: 'Débutant',
    students: 156,
    category: 'Poterie'
  },
  {
    id: 2,
    title: 'Tissage Traditionnel',
    description: 'Maîtrisez l\'art du tissage avec des techniques ancestrales',
    image: 'https://youtu.be/IgoerezVBJI?si=WEAUZMXSt6AzyZe2',
    duration: '3h 15min',
    level: 'Intermédiaire',
    students: 89,
    category: 'Textile'
  },
  {
    id: 3,
    title: 'Sculpture sur Bois',
    description: 'Créez vos premières sculptures en bois d\'ébène',
    image: 'https://youtu.be/7Lnqt1aKKtg?si=wlkV3VDJ1JUmM5xO',
    duration: '4h 00min',
    level: 'Avancé',
    students: 67,
    category: 'Sculpture'
  },
  {
    id: 4,
    title: 'Bijouterie Artisanale',
    description: 'Concevez et réalisez vos propres bijoux authentiques',
    image: 'https://youtu.be/eGfSsPqr1rA?si=HGLlMkeXsPdWGZnk',
    duration: '2h 45min',
    level: 'Débutant',
    students: 234,
    category: 'Bijoux'
  },
  {
    id: 5,
    title: 'Tissage Traditionnel',
    description: 'Maîtrisez l\'art du tissage avec des techniques ancestrales',
    image: 'https://youtu.be/w3AFBBbLDd8?si=e2qey2yjWkiUqdMY',
    duration: '3h 15min',
    level: 'Intermédiaire',
    students: 89,
    category: 'Textile'
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

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com.*[?&]v=)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
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
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              640: { slidesPerView: 2, slidesPerGroup: 2 },
              1024: { slidesPerView: 4, slidesPerGroup: 4 },
            }}
            navigation
            className="tutorials-swiper pb-8"
            style={{ padding: 0, margin: 0 }}
          >
            {tutorials.map((tutorial) => {
              const isYoutube = tutorial.image.includes('youtu');
              const youtubeId = isYoutube ? getYoutubeId(tutorial.image) : null;
              const thumbnail = youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : tutorial.image;
              return (
                <SwiperSlide key={tutorial.id}>
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-[1.03] active:scale-95 bg-white/80 backdrop-blur-sm border-white/50 rounded-2xl min-h-[420px] flex flex-col">
                    <div className="relative">
                      {isYoutube ? (
                        <a href={tutorial.image} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={thumbnail} 
                            alt={tutorial.title}
                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </a>
                      ) : (
                        <img 
                          src={tutorial.image} 
                          alt={tutorial.title}
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <Badge className={`absolute top-2 right-2 ${getLevelColor(tutorial.level)}`}>{tutorial.level}</Badge>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {tutorial.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
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
                        onClick={() => isYoutube ? window.open(tutorial.image, '_blank') : handleStartTutorial(tutorial.id)}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 mt-auto"
                      >
                        Commencer le cours
                      </Button>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              );
            })}
          </Swiper>
          {/* Swiper navigation arrows styling (optional, can be customized further) */}
          <style>{`
            .tutorials-swiper .swiper-button-next,
            .tutorials-swiper .swiper-button-prev {
              color: #6366f1;
              top: 40%;
              width: 2.5rem;
              height: 2.5rem;
              background: white;
              border-radius: 9999px;
              box-shadow: 0 2px 8px 0 rgba(99,102,241,0.08);
              transition: background 0.2s;
            }
            .tutorials-swiper .swiper-button-next:hover,
            .tutorials-swiper .swiper-button-prev:hover {
              background: #e0e7ff;
            }
            .tutorials-swiper .swiper-button-next:after,
            .tutorials-swiper .swiper-button-prev:after {
              font-size: 1.5rem;
              font-weight: bold;
            }
          `}</style>
        </div>
        <div className="text-center mt-8">
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
