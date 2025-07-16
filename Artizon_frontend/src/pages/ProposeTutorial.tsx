
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, Send, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProposeTutorial = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    videoUrl: '',
    authorName: '',
    authorEmail: '',
    authorBio: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    setTimeout(() => {
      toast({
        title: "Tutoriel proposé avec succès!",
        description: "Votre proposition sera examinée par notre équipe. Vous recevrez un email de confirmation sous 48h."
      });
      setIsSubmitting(false);
      navigate('/tutoriels');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#EDF0E0]">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/tutoriels')}
              className="mb-4 text-[#405B35] hover:text-[#405B35]/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux tutoriels
            </Button>
            <h1 className="text-4xl font-bold text-[#405B35] mb-4">
              Proposer un Tutoriel
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Partagez votre expertise avec notre communauté d'artisans. 
              Votre tutoriel sera examiné par notre équipe avant publication.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#405B35]">Informations du Tutoriel</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations du tutoriel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Titre du tutoriel *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Techniques de base en poterie"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Poterie">Poterie</SelectItem>
                        <SelectItem value="Textile">Textile</SelectItem>
                        <SelectItem value="Sculpture">Sculpture</SelectItem>
                        <SelectItem value="Bijoux">Bijoux</SelectItem>
                        <SelectItem value="Maroquinerie">Maroquinerie</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description détaillée *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez le contenu de votre tutoriel, les compétences enseignées, les prérequis..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="level">Niveau de difficulté *</Label>
                    <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Débutant">Débutant</SelectItem>
                        <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                        <SelectItem value="Avancé">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Durée estimée *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Ex: 2h 30min"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="videoUrl">Lien vidéo (YouTube, Vimeo...)</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Si vous n'avez pas encore de vidéo, vous pourrez l'ajouter plus tard
                  </p>
                </div>

                {/* Informations sur l'auteur */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-[#405B35] mb-4">Vos Informations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="authorName">Votre nom *</Label>
                      <Input
                        id="authorName"
                        value={formData.authorName}
                        onChange={(e) => handleInputChange('authorName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorEmail">Votre email *</Label>
                      <Input
                        id="authorEmail"
                        type="email"
                        value={formData.authorEmail}
                        onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="authorBio">Présentez-vous brièvement</Label>
                    <Textarea
                      id="authorBio"
                      value={formData.authorBio}
                      onChange={(e) => handleInputChange('authorBio', e.target.value)}
                      placeholder="Parlez de votre expérience, vos spécialités, votre parcours..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Notes additionnelles */}
                <div>
                  <Label htmlFor="additionalNotes">Notes additionnelles</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Informations supplémentaires, matériel nécessaire, liens utiles..."
                    rows={3}
                  />
                </div>

                {/* Zone de téléchargement de fichiers */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Fichiers complémentaires</h4>
                  <p className="text-gray-500 mb-4">
                    Glissez-déposez ou cliquez pour ajouter des documents PDF, images, ou autres ressources
                  </p>
                  <Button type="button" variant="outline">
                    Choisir des fichiers
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Formats acceptés: PDF, JPG, PNG, DOC. Taille max: 10MB par fichier
                  </p>
                </div>

                {/* Conditions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Conditions de soumission</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Votre tutoriel sera examiné par notre équipe sous 48h</li>
                    <li>• Nous vous contacterons par email pour toute question ou modification</li>
                    <li>• Le contenu doit être original et respecter les droits d'auteur</li>
                    <li>• Une fois publié, votre tutoriel sera accessible gratuitement à la communauté</li>
                  </ul>
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/tutoriels')}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#405B35] hover:bg-[#405B35]/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Soumettre le tutoriel
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <FloatingCart />
    </div>
  );
};

export default ProposeTutorial;
