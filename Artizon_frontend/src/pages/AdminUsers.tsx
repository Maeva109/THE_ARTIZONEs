import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserForm } from '@/components/admin/UserForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Check, 
  X, 
  Trash2, 
  Mail, 
  Download,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const AdminUsers = () => {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { toast } = useToast();
  const [error, setError] = useState('');

  // Fetch users from API
  useEffect(() => {
    fetch('http://localhost:8000/api/users/', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
          setError('');
        } else {
          setUsers([]);
          setError('Accès refusé ou erreur d\'API');
        }
      })
      .catch(() => {
        setUsers([]);
        setError('Accès refusé ou erreur d\'API');
      });
  }, [accessToken]);

  const handleCreateUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      date_joined: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // PATCH user (role/statut)
  const handleEditUser = async (userData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u));
        toast({ title: 'Utilisateur modifié avec succès' });
      } else {
        const errorData = await res.json();
        toast({ 
          title: 'Erreur', 
          description: errorData.error || 'Erreur lors de la modification',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Erreur', 
        description: 'Erreur de connexion',
        variant: 'destructive'
      });
    }
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // DELETE user
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast({ title: 'Utilisateur supprimé avec succès' });
      } else {
        toast({ 
          title: 'Erreur', 
          description: 'Erreur lors de la suppression',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Erreur', 
        description: 'Erreur de connexion',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case 'artisan':
        return <Badge className="bg-blue-100 text-blue-800">Artisan</Badge>;
      case 'client':
        return <Badge className="bg-gray-100 text-gray-800">Client</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérer les comptes clients et artisans</p>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filtres et Recherche</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#405B35] hover:bg-[#405B35]/90"
                  onClick={() => {
                    setEditingUser(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="artisan">Artisan</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Artisans à valider
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Liste des Utilisateurs ({Array.isArray(users) ? users.length : 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {Array.isArray(users) ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.nom}</TableCell>
                      <TableCell>{user.prenom}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.telephone}</TableCell>
                      <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                      <TableCell>{user.date_joined?.split('T')[0]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingUser(user);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Affichage de 1 à {Array.isArray(users) ? users.length : 0} sur {Array.isArray(users) ? users.length : 0} utilisateurs
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button variant="outline" size="sm" className="bg-[#405B35] text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={editingUser}
              onSubmit={editingUser ? handleEditUser : handleCreateUser}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingUser(null);
              }}
              mode={editingUser ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
