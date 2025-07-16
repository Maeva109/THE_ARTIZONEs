import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const ArtisanForm = ({ open, onClose, onSubmit, artisan }) => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    departement: '',
    ville: '',
    boutique_id: '',
    description_artisan: '',
    statut: 'en_attente',
  });

  useEffect(() => {
    if (artisan) {
      setForm({
        nom: artisan.user.nom || '',
        prenom: artisan.user.prenom || '',
        email: artisan.user.email || '',
        telephone: artisan.user.telephone || '',
        departement: artisan.departement || '',
        ville: artisan.ville || '',
        boutique_id: artisan.boutique_id || '',
        description_artisan: artisan.description_artisan || '',
        statut: artisan.statut || 'en_attente',
      });
    } else {
      setForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        departement: '',
        ville: '',
        boutique_id: '',
        description_artisan: '',
        statut: 'en_attente',
      });
    }
  }, [artisan]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{artisan ? 'Modifier Artisan' : 'Créer un Artisan'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required />
          <Input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" required />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <Input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
          <Input name="departement" value={form.departement} onChange={handleChange} placeholder="Département" />
          <Input name="ville" value={form.ville} onChange={handleChange} placeholder="Ville" />
          <Input name="boutique_id" value={form.boutique_id} onChange={handleChange} placeholder="Boutique ID" />
          <Input name="description_artisan" value={form.description_artisan} onChange={handleChange} placeholder="Description" />
          <Button type="submit" className="w-full">{artisan ? 'Enregistrer' : 'Créer'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 