
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, ShoppingCart, CreditCard, AlertTriangle, UserCheck, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const DashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/stats/', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, [accessToken]);

  if (!stats) return <div>Chargement...</div>;

  const cards = [
    {
      title: 'Artisans',
      value: stats.artisans,
      icon: UserCheck,
      route: '/admin/users?filter=artisans',
    },
    {
      title: 'Clients',
      value: stats.clients,
      icon: Users,
      route: '/admin/users?filter=clients',
    },
    {
      title: 'Produits en ligne',
      value: stats.products,
      icon: Package,
      route: '/admin/products',
    },
    {
      title: 'Commandes',
      value: stats.orders,
      icon: ShoppingCart,
      route: '/admin/orders',
    },
    {
      title: 'Paiements en attente',
      value: stats.pending_payments,
      icon: CreditCard,
      route: '/admin/payments?filter=pending',
    },
    {
      title: 'Litiges ouverts',
      value: stats.open_disputes,
      icon: AlertTriangle,
      route: '/admin/disputes?filter=open',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((stat, index) => (
        <Card key={index} className="bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(stat.route)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
