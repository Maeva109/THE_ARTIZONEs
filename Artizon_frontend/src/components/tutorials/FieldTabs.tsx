
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Calendar, User } from 'lucide-react';

const trainingFields = [
  {
    id: 'bijouterie',
    name: 'Bijouterie',
    description: 'Maîtrisez l\'art de la création de bijoux traditionnels et modernes',
    objectives: 'Apprendre les techniques de base, utiliser les outils, créer des pièces uniques',
    targetAudience: 'Débutants et artisans souhaitant se spécialiser',
    categories: [
      {
        id: 'boucles-oreilles',
        name: 'Boucles d\'oreilles',
        modules: [
          {
            id: 1,
            title: "Boucles d'oreilles en résine",
            level: "Débutant",
            duration: "1h",
            format: "Vidéo",
            trainer: { name: "Sarah Lefevre", photo: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=50&h=50&fit=crop&crop=face" }
          }
        ]
      },
      {
        id: 'colliers',
        name: 'Colliers',
        modules: [
          {
            id: 2,
            title: "Colliers en perles traditionnelles",
            level: "Intermédiaire",
            duration: "2h",
            format: "Vidéo",
            trainer: { name: "Marie Dubois", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" }
          }
        ]
      }
    ]
  },
  {
    id: 'textile',
    name: 'Textile',
    description: 'Explorez les techniques ancestrales du textile camerounais',
    objectives: 'Maîtriser le tissage, la broderie et la teinture traditionnelle',
    targetAudience: 'Artisans textiles et passionnés de mode',
    categories: [
      {
        id: 'tissage',
        name: 'Tissage',
        modules: [
          {
            id: 3,
            title: "Techniques de tissage traditionnel",
            level: "Intermédiaire",
            duration: "2h30",
            format: "Vidéo",
            trainer: { name: "Thomas Durant", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" }
          }
        ]
      },
      {
        id: 'broderie',
        name: 'Broderie',
        modules: [
          {
            id: 4,
            title: "Broderie à la main - Motifs camerounais",
            level: "Avancé",
            duration: "3h",
            format: "Atelier",
            trainer: { name: "Camille Morel", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" }
          }
        ]
      }
    ]
  },
  {
    id: 'sculpture',
    name: 'Sculpture',
    description: 'Sculptez le bois et la pierre selon les traditions camerounaises',
    objectives: 'Apprendre les techniques de sculpture, utiliser les outils traditionnels',
    targetAudience: 'Artistes et artisans sculpteurs',
    categories: [
      {
        id: 'bois',
        name: 'Sculpture sur bois',
        modules: [
          {
            id: 5,
            title: "Techniques de sculpture sur bois",
            level: "Intermédiaire",
            duration: "2h30",
            format: "Vidéo",
            trainer: { name: "Thomas Durant", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" }
          }
        ]
      }
    ]
  },
  {
    id: 'ceramique',
    name: 'Céramique',
    description: 'Créez des poteries et céramiques dans la pure tradition',
    objectives: 'Maîtriser le tournage, la cuisson et la décoration',
    targetAudience: 'Débutants et potiers confirmés',
    categories: [
      {
        id: 'poterie',
        name: 'Poterie',
        modules: [
          {
            id: 6,
            title: "Initiation au tournage",
            level: "Débutant",
            duration: "2h",
            format: "Atelier",
            trainer: { name: "Adrien Bernard", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" }
          }
        ]
      }
    ]
  }
];

const getFormatIcon = (format: string) => {
  switch (format) {
    case "Vidéo":
      return <PlayCircle className="h-4 w-4" />;
    case "PDF":
      return <FileText className="h-4 w-4" />;
    case "Atelier":
      return <Calendar className="h-4 w-4" />;
    default:
      return null;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "Débutant":
      return "bg-green-100 text-green-800";
    case "Intermédiaire":
      return "bg-yellow-100 text-yellow-800";
    case "Avancé":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const FieldTabs = () => {
  const [selectedField, setSelectedField] = useState('bijouterie');

  return (
    <div className="w-full">
      <Tabs value={selectedField} onValueChange={setSelectedField} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {trainingFields.map((field) => (
            <TabsTrigger key={field.id} value={field.id} className="text-sm font-medium">
              {field.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {trainingFields.map((field) => (
          <TabsContent key={field.id} value={field.id} className="space-y-6">
            {/* Plan de formation général */}
            <Card className="bg-gradient-to-r from-[#405B35]/10 to-orange-50">
              <CardHeader>
                <CardTitle className="text-2xl text-[#405B35]">
                  Plan de formation - {field.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{field.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-[#405B35] mb-2">🎯 Objectifs</h4>
                    <p className="text-sm text-gray-600">{field.objectives}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#405B35] mb-2">👥 Public concerné</h4>
                    <p className="text-sm text-gray-600">{field.targetAudience}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catégories et modules */}
            <div className="space-y-6">
              {field.categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-xl text-[#405B35]">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {category.modules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getFormatIcon(module.format)}
                              <span className="text-sm text-gray-600">{module.format}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{module.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge className={getLevelColor(module.level)} variant="secondary">
                                  {module.level}
                                </Badge>
                                <span className="text-sm text-gray-600">⏱️ {module.duration}</span>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="text-sm text-gray-600">{module.trainer.name}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button className="bg-[#405B35] hover:bg-[#405B35]/90 text-white">
                            Commencer le module
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
