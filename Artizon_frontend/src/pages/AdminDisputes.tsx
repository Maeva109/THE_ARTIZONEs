
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Eye, 
  Download,
  AlertTriangle,
  CalendarDays,
  MessageSquare
} from 'lucide-react';

// Mock data
const disputes = [
  {
    id: '001',
    type: 'Produit non conforme',
    client: 'Marie Durand',
    artisan: 'Sophie Bernard',
    orderId: 'CMD-001',
    date: '2024-01-15',
    status: 'Ouvert',
    priority: 'Haute',
    lastUpdate: '2024-01-16',
  },
  {
    id: '002',
    type: 'Retard de livraison',
    client: 'Jean Martin',
    artisan: 'Marie Dupont',
    orderId: 'CMD-002',
    date: '2024-01-14',
    status: 'En cours',
    priority: 'Moyenne',
    lastUpdate: '2024-01-16',
  },
  {
    id: '003',
    type: 'Remboursement',
    client: 'Paul Moreau',
    artisan: 'Jean Martin',
    orderId: 'CMD-003',
    date: '2024-01-10',
    status: 'Résolu',
    priority: 'Basse',
    lastUpdate: '2024-01-12',
  },
  {
    id: '004',
    type: 'Problème qualité',
    client: 'Claire Dubois',
    artisan: 'Sophie Bernard',
    orderId: 'CMD-004',
    date: '2024-01-13',
    status: 'En cours',
    priority: 'Haute',
    lastUpdate: '2024-01-17',
  },
];

const AdminDisputes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ouvert':
        return <Badge className="bg-red-100 text-red-800">Ouvert</Badge>;
      case 'En cours':
        return <Badge className="bg-orange-100 text-orange-800">En cours</Badge>;
      case 'Résolu':
        return <Badge className="bg-green-100 text-green-800">Résolu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return <Badge className="bg-red-100 text-red-800">Haute</Badge>;
      case 'Moyenne':
        return <Badge className="bg-orange-100 text-orange-800">Moyenne</Badge>;
      case 'Basse':
        return <Badge className="bg-gray-100 text-gray-800">Basse</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return <Badge variant="outline" className="bg-blue-50">{type}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Litiges</h1>
          <p className="text-gray-600">Résoudre les différends entre clients et artisans</p>
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
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher parties, type, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Résolu">Résolu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de litige" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Produit non conforme">Produit non conforme</SelectItem>
                  <SelectItem value="Retard de livraison">Retard de livraison</SelectItem>
                  <SelectItem value="Remboursement">Remboursement</SelectItem>
                  <SelectItem value="Problème qualité">Problème qualité</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input type="date" className="flex-1" />
                <Input type="date" className="flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disputes Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Liste des Litiges ({disputes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type de litige</TableHead>
                  <TableHead>Parties impliquées</TableHead>
                  <TableHead>Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière MAJ</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                    <TableCell>{getTypeBadge(dispute.type)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Client:</span> {dispute.client}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Artisan:</span>{' '}
                          <Button variant="link" className="p-0 h-auto text-[#405B35] text-sm">
                            {dispute.artisan}
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-[#405B35] font-mono">
                        {dispute.orderId}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        {dispute.date}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(dispute.priority)}</TableCell>
                    <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {dispute.lastUpdate}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" title="Voir le détail">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Messages">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Exporter">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Affichage de 1 à {disputes.length} sur {disputes.length} litiges
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
      </div>
    </AdminLayout>
  );
};

export default AdminDisputes;
