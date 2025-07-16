
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Package, CreditCard, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const approvals = [
  {
    id: 1,
    type: 'artisan',
    icon: UserCheck,
    title: 'Nouveaux artisans à valider',
    count: 8,
    color: 'bg-green-100 text-green-800',
    route: '/admin/users?filter=pending-artisans'
  },
  {
    id: 2,
    type: 'product',
    icon: Package,
    title: 'Produits à valider',
    count: 15,
    color: 'bg-blue-100 text-blue-800',
    route: '/admin/products?filter=pending'
  },
  {
    id: 3,
    type: 'payment',
    icon: CreditCard,
    title: 'Paiements manuels à valider',
    count: 3,
    color: 'bg-orange-100 text-orange-800',
    route: '/admin/payments?filter=manual-pending'
  },
  {
    id: 4,
    type: 'moderation',
    icon: MessageSquare,
    title: 'Avis/Boutiques à modérer',
    count: 12,
    color: 'bg-purple-100 text-purple-800',
    route: '/admin/moderation?filter=pending'
  }
];

export const PendingApprovals = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-[#405B35]" />
          Tâches d'approbation en attente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {approvals.map((approval) => (
          <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <approval.icon className="h-5 w-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-sm">{approval.title}</h4>
                <Badge className={`text-xs ${approval.color}`}>
                  {approval.count} en attente
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(approval.route)}
              className="text-xs"
            >
              Traiter
            </Button>
          </div>
        ))}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600 text-center">
            Total: {approvals.reduce((sum, item) => sum + item.count, 0)} tâches en attente
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
