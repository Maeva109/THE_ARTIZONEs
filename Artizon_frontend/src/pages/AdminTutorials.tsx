import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tutorialAPI } from '@/lib/api';

interface Tutorial {
  id: number;
  title: string;
  description: string;
  field: string;
  category: string;
  objectives?: string;
  skills?: string;
  target_audience?: string;
  format: string;
  level: string;
  resource_url?: string;
  image?: string;
  trainer: string;
  trainer_profile?: string;
  schedule?: string;
  status: 'published' | 'draft' | 'scheduled';
  published_at?: string;
  created_by?: string;
  created_at?: string;
}

const FIELD_OPTIONS = [
  'Bijouterie', 'Textile', 'Sculpture', 'Céramique'
];
const CATEGORY_OPTIONS = ["Boucles d'oreilles", "Colliers", "Tissage", "Broderie", "Sculpture sur bois", "Poterie"];

const AdminTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    field: '',
    category: '',
    format: '',
    level: '',
    trainer: '',
    objectives: '',
    skills: '',
    target_audience: '',
    resource_url: '',
    trainer_profile: '',
    schedule: '',
    status: 'draft',
  });

  const [customField, setCustomField] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  // Fetch all tutorials
  useEffect(() => {
    tutorialAPI.getTutorials().then(setTutorials);
  }, []);

  // Filtering
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tutorial.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CRUD Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      field: formData.field === 'other' ? customField : formData.field,
      category: formData.category === 'other' ? customCategory : formData.category,
    };
    try {
    if (editingTutorial) {
        await tutorialAPI.updateTutorial(editingTutorial.id, dataToSend);
        toast({ title: 'Tutoriel modifié avec succès' });
    } else {
        await tutorialAPI.createTutorial(dataToSend);
        toast({ title: 'Tutoriel créé avec succès' });
      }
      setIsDialogOpen(false);
      setEditingTutorial(null);
    setFormData({
        title: '', description: '', field: '', category: '', format: '', level: '', trainer: '', objectives: '', skills: '', target_audience: '', resource_url: '', trainer_profile: '', schedule: '', status: 'draft',
      });
      setCustomField('');
      setCustomCategory('');
      tutorialAPI.getTutorials().then(setTutorials);
    } catch (err: any) {
      toast({ title: err.message, variant: 'destructive' });
    }
  };

  const handleEdit = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({ ...tutorial });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tutorialAPI.deleteTutorial(id);
      toast({ title: 'Tutoriel supprimé' });
      tutorialAPI.getTutorials().then(setTutorials);
    } catch (err: any) {
      toast({ title: err.message, variant: 'destructive' });
    }
  };

  const toggleStatus = async (id: number) => {
    const tutorial = tutorials.find(t => t.id === id);
    if (!tutorial) return;
    const newStatus = tutorial.status === 'published' ? 'draft' : 'published';
    try {
      await tutorialAPI.updateTutorial(id, { ...tutorial, status: newStatus });
      tutorialAPI.getTutorials().then(setTutorials);
    } catch (err: any) {
      toast({ title: err.message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Publié</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Brouillon</Badge>;
      case 'scheduled':
        return <Badge className="bg-orange-500">Planifié</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#405B35]">Gestion des Tutoriels</h1>
            <p className="text-gray-600">Gérez les tutoriels et formations de la plateforme</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#405B35] hover:bg-[#405B35]/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Tutoriel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTutorial ? 'Modifier le tutoriel' : 'Créer un nouveau tutoriel'}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                {editingTutorial
                  ? 'Modifiez les informations du tutoriel sélectionné.'
                  : 'Remplissez ce formulaire pour créer un nouveau tutoriel. Tous les champs sont obligatoires.'}
              </DialogDescription>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="field">Champ</Label>
                    <Select
                      value={formData.field}
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, field: value }));
                        if (value !== 'other') setCustomField('');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                        <SelectItem value="other">Autre…</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.field === 'other' && (
                      <Input
                        placeholder="Entrez un champ personnalisé"
                        value={customField}
                        onChange={e => setCustomField(e.target.value)}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, category: value }));
                      if (value !== 'other') setCustomCategory('');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                      <SelectItem value="other">Autre…</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.category === 'other' && (
                    <Input
                      placeholder="Entrez une catégorie personnalisée"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    className="min-h-[100px] w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Niveau</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="format">Format</Label>
                    <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vidéo</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="workshop">Atelier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="trainer">Formateur</Label>
                  <Input
                    id="trainer"
                    value={formData.trainer}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainer: e.target.value }))}
                    placeholder="Nom du formateur"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="trainer_profile">Profil du formateur</Label>
                  <Input
                    id="trainer_profile"
                    value={formData.trainer_profile}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainer_profile: e.target.value }))}
                    placeholder="Lien vers le profil du formateur"
                  />
                </div>

                <div>
                  <Label htmlFor="schedule">Programme</Label>
                  <Textarea
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    placeholder="Description du programme"
                    required
                    className="min-h-[100px] w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="objectives">Objectifs</Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                    placeholder="Objectifs du tutoriel"
                    className="min-h-[100px] w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Compétences</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="Compétences acquises"
                    className="min-h-[100px] w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="target_audience">Public cible</Label>
                  <Textarea
                    id="target_audience"
                    value={formData.target_audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                    placeholder="Public cible du tutoriel"
                    className="min-h-[100px] w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="resource_url">Lien de ressource</Label>
                  <Input
                    id="resource_url"
                    value={formData.resource_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, resource_url: e.target.value }))}
                    placeholder="Lien vers la ressource"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-[#405B35] hover:bg-[#405B35]/90">
                    {editingTutorial ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un tutoriel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des tutoriels */}
        <div className="grid gap-4">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[#405B35]">{tutorial.title}</h3>
                      {getStatusBadge(tutorial.status)}
                    </div>
                    <p className="text-gray-600 mb-3">{tutorial.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Champ: {tutorial.field}</span>
                      <span>Catégorie: {tutorial.category}</span>
                      <span>Niveau: {tutorial.level}</span>
                      <span>Format: {tutorial.format}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Par: {tutorial.trainer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(tutorial.id)}
                    >
                      {tutorial.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(tutorial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(tutorial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Aucun tutoriel trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTutorials;
