import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, Edit, Check, X, Trash2, Hammer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ArtisanForm } from '@/components/admin/ArtisanForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const API_URL = 'http://localhost:8000/api/artisans/';

const AdminArtisans = () => {
  const { accessToken } = useAuth();
  const [artisans, setArtisans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState(null);
  const [departementFilter, setDepartementFilter] = useState('');
  const [boutiqueFilter, setBoutiqueFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [detailArtisan, setDetailArtisan] = useState(null);

  // Fetch artisans from API
  useEffect(() => {
    let url = API_URL;
    const params = [];
    if (searchTerm) params.push(`nom=${encodeURIComponent(searchTerm)}`);
    if (statusFilter !== 'all') params.push(`statut=${encodeURIComponent(statusFilter)}`);
    if (departementFilter) params.push(`departement=${encodeURIComponent(departementFilter)}`);
    if (boutiqueFilter) params.push(`boutique_id=${encodeURIComponent(boutiqueFilter)}`);
    if (params.length) url += '?' + params.join('&');
    fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setArtisans(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => {
        setArtisans([]);
        setError('Accès refusé ou erreur d’API');
      });
  }, [accessToken, searchTerm, statusFilter, departementFilter, boutiqueFilter]);

  // Create or Edit
  const handleFormSubmit = (form) => {
    if (editingArtisan) {
      // Edit
      fetch(`${API_URL}${editingArtisan.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          ...editingArtisan,
          ...form,
          user: { ...editingArtisan.user, nom: form.nom, prenom: form.prenom, email: form.email, telephone: form.telephone }
        })
      })
        .then(res => res.json())
        .then(() => {
          setIsDialogOpen(false);
          setEditingArtisan(null);
          toast({ title: 'Artisan modifié avec succès' });
          setTimeout(() => window.location.reload(), 500);
        });
    } else {
      // Create
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          user: {
            nom: form.nom,
            prenom: form.prenom,
            email: form.email,
            telephone: form.telephone,
          },
          departement: form.departement,
          ville: form.ville,
          boutique_id: form.boutique_id,
          description_artisan: form.description_artisan,
          statut: form.statut,
        })
      })
        .then(res => res.json())
        .then(() => {
          setIsDialogOpen(false);
          toast({ title: 'Artisan créé avec succès' });
          setTimeout(() => window.location.reload(), 500);
        });
    }
  };

  // Delete confirmation
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    fetch(`${API_URL}${deleteId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => {
        if (res.ok) {
          setArtisans(artisans => artisans.filter(a => a.id !== deleteId));
          toast({ title: 'Artisan supprimé' });
        }
        setDeleteId(null);
      });
  };

  // Actions
  const handleValidate = (id) => {
    fetch(`${API_URL}${id}/validate/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(() => {
        setArtisans(artisans => artisans.map(a => a.id === id ? { ...a, statut: 'valide' } : a));
        toast({ title: 'Artisan validé avec succès' });
      });
  };
  const handleReject = (id) => {
    fetch(`${API_URL}${id}/reject/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(() => {
        setArtisans(artisans => artisans.map(a => a.id === id ? { ...a, statut: 'suspendu' } : a));
        toast({ title: 'Artisan suspendu' });
      });
  };
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'valide':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'en_attente':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'suspendu':
        return <Badge className="bg-gray-100 text-gray-800">Suspendu</Badge>;
      case 'supprime':
        return <Badge className="bg-red-100 text-red-800">Supprimé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Hammer className="h-6 w-6" />Gestion des Artisans</h1>
          <p className="text-gray-600">Gérer les comptes artisans, validation, suspension, suppression…</p>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filtres et Recherche</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                  <SelectItem value="supprime">Supprimé</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filtrer par département"
                value={departementFilter}
                onChange={e => setDepartementFilter(e.target.value)}
              />
              <Input
                placeholder="Filtrer par boutique ID"
                value={boutiqueFilter}
                onChange={e => setBoutiqueFilter(e.target.value)}
              />
              <Button
                size="sm"
                className="bg-[#405B35] hover:bg-[#405B35]/90"
                onClick={() => {
                  setEditingArtisan(null);
                  setIsDialogOpen(true);
                }}
              >
                + Nouvel artisan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Artisans Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Liste des Artisans ({Array.isArray(artisans) ? artisans.length : 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {Array.isArray(artisans) ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date inscription</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artisans.map((artisan) => (
                    <TableRow key={artisan.id}>
                      <TableCell className="font-mono text-sm">{artisan.id}</TableCell>
                      <TableCell className="font-medium">{artisan.user.nom}</TableCell>
                      <TableCell>{artisan.user.prenom}</TableCell>
                      <TableCell>{artisan.user.email}</TableCell>
                      <TableCell>{getStatusBadge(artisan.statut)}</TableCell>
                      <TableCell>{artisan.date_inscription?.split('T')[0]}</TableCell>
                      <TableCell>{artisan.departement}</TableCell>
                      <TableCell>{artisan.ville}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleValidate(artisan.id)} disabled={artisan.statut === 'valide'}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleReject(artisan.id)} disabled={artisan.statut === 'suspendu'}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setEditingArtisan(artisan); setIsDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDetailArtisan(artisan)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteId(artisan.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
      </div>
      {/* Artisan Form Modal */}
      <ArtisanForm
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingArtisan(null); }}
        onSubmit={handleFormSubmit}
        artisan={editingArtisan}
      />
      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div>Voulez-vous vraiment supprimer cet artisan ?</div>
          <div className="flex gap-2 mt-4">
            <Button variant="destructive" onClick={handleDeleteConfirm}>Supprimer</Button>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Artisan Detail Modal */}
      <Dialog open={!!detailArtisan} onOpenChange={() => setDetailArtisan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail de l'artisan</DialogTitle>
          </DialogHeader>
          {detailArtisan && (
            <div className="space-y-2">
              <div><b>Nom:</b> {detailArtisan.user.nom}</div>
              <div><b>Prénom:</b> {detailArtisan.user.prenom}</div>
              <div><b>Email:</b> {detailArtisan.user.email}</div>
              <div><b>Téléphone:</b> {detailArtisan.user.telephone}</div>
              <div><b>Département:</b> {detailArtisan.departement}</div>
              <div><b>Ville:</b> {detailArtisan.ville}</div>
              <div><b>Boutique ID:</b> {detailArtisan.boutique_id}</div>
              <div><b>Description:</b> {detailArtisan.description_artisan}</div>
              <div><b>Statut:</b> {getStatusBadge(detailArtisan.statut)}</div>
              <div><b>Date inscription:</b> {detailArtisan.date_inscription?.split('T')[0]}</div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Documents soumis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'demande_timbre', label: 'Demande timbre' },
                    { key: 'attestation_enregistrement', label: "Attestation d'enregistrement" },
                    { key: 'copie_cni', label: 'Copie CNI' },
                    { key: 'photos_produits', label: 'Photos produits' },
                    { key: 'plan_localisation', label: 'Plan de localisation' },
                  ].map(({ key, label }) => {
                    const file = detailArtisan[key];
                    if (!file) {
                      return (
                        <div key={key} className="border rounded p-2 text-gray-500">{label}: <span className="text-red-500">Non fourni</span></div>
                      );
                    }
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
                    return (
                      <div key={key} className="border rounded p-2">
                        <div className="font-medium mb-1">{label}</div>
                        {isImage ? (
                          <img
                            src={file.startsWith('http') ? file : `http://localhost:8000${file}`}
                            alt={label}
                            className="w-full h-32 object-contain rounded mb-2 border"
                          />
                        ) : null}
                        <a
                          href={file.startsWith('http') ? file : `http://localhost:8000${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Télécharger
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleValidate(detailArtisan.id)}
                  disabled={detailArtisan.statut === 'valide'}
                >
                  Valider
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleReject(detailArtisan.id)}
                  disabled={detailArtisan.statut === 'suspendu'}
                >
                  Rejeter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminArtisans; 