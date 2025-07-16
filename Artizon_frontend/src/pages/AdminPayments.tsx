
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
  Check, 
  X, 
  Download,
  CreditCard,
  CalendarDays
} from 'lucide-react';

// Mock data
const payments = [
  {
    id: '001',
    orderId: 'CMD-001',
    client: 'Marie Durand',
    artisan: 'Sophie Bernard',
    paymentMethod: 'Carte bancaire',
    amount: 67500,
    date: '2024-01-15',
    status: 'Validé',
  },
  {
    id: '002',
    orderId: 'CMD-002',
    client: 'Jean Martin',
    artisan: 'Marie Dupont',
    paymentMethod: 'Mobile Money',
    amount: 25000,
    date: '2024-01-16',
    status: 'En attente',
  },
  {
    id: '003',
    orderId: 'CMD-003',
    client: 'Paul Moreau',
    artisan: 'Jean Martin',
    paymentMethod: 'Virement',
    amount: 45000,
    date: '2024-01-17',
    status: 'Validé',
  },
  {
    id: '004',
    orderId: 'CMD-004',
    client: 'Claire Dubois',
    artisan: 'Sophie Bernard',
    paymentMethod: 'Carte bancaire',
    amount: 18000,
    date: '2024-01-14',
    status: 'Rejeté',
  },
];

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En attente':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'Validé':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'Rejeté':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'Carte bancaire':
        return <Badge variant="outline" className="bg-blue-50">Carte bancaire</Badge>;
      case 'Mobile Money':
        return <Badge variant="outline" className="bg-green-50">Mobile Money</Badge>;
      case 'Virement':
        return <Badge variant="outline" className="bg-purple-50">Virement</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleValidatePayment = (paymentId: string) => {
    console.log(`Validate payment ${paymentId}`);
    // Here you would implement the payment validation logic
  };

  const handleRejectPayment = (paymentId: string) => {
    console.log(`Reject payment ${paymentId}`);
    // Here you would implement the payment rejection logic
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
          <p className="text-gray-600">Suivre et valider les paiements de la plateforme</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher client, artisan, ID..."
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
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Validé">Validé</SelectItem>
                  <SelectItem value="Rejeté">Rejeté</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les modes</SelectItem>
                  <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Virement">Virement</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input type="date" className="flex-1" />
                <Input type="date" className="flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Liste des Paiements ({payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Mode de paiement</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-[#405B35] font-mono">
                        {payment.orderId}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{payment.client}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-[#405B35]">
                        {payment.artisan}
                      </Button>
                    </TableCell>
                    <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                    <TableCell className="font-mono font-medium">
                      {formatPrice(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        {payment.date}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {payment.status === 'En attente' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600"
                              title="Valider"
                              onClick={() => handleValidatePayment(payment.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600"
                              title="Rejeter"
                              onClick={() => handleRejectPayment(payment.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
                Affichage de 1 à {payments.length} sur {payments.length} paiements
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

export default AdminPayments;
