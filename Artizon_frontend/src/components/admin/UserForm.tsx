import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface User {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'admin' | 'artisan' | 'client';
  is_active: boolean;
  date_joined?: string;
}

interface UserFormProps {
  user?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel, 
  mode 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<User>({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    role: user?.role || 'client',
    is_active: user?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "L'adresse email n'est pas valide",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      ...formData,
      id: user?.id || Date.now().toString(),
      date_joined: user?.date_joined || new Date().toISOString().split('T')[0]
    });

    toast({
      title: mode === 'create' ? "Utilisateur créé" : "Utilisateur modifié",
      description: `L'utilisateur "${formData.prenom} ${formData.nom}" a été ${mode === 'create' ? 'créé' : 'modifié'} avec succès`
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === 'create' ? 'Créer un nouvel utilisateur' : 'Modifier l\'utilisateur'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                placeholder="Jean"
                required
              />
            </div>
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="jean.dupont@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                placeholder="+33 6 12 34 56 78"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'artisan' | 'client') => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="artisan">Artisan</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="is_active">Statut</Label>
              <Select value={formData.is_active ? 'active' : 'inactive'} onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value === 'active' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-[#405B35] hover:bg-[#405B35]/90">
              {mode === 'create' ? 'Créer l\'utilisateur' : 'Modifier l\'utilisateur'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
