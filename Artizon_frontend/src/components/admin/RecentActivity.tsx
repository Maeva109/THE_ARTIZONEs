
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const activities = [
  {
    id: 1,
    type: 'order',
    message: 'Nouvelle commande #1234',
    user: 'Marie Dubois',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'success',
  },
  {
    id: 2,
    type: 'product',
    message: 'Produit ajouté en attente de validation',
    user: 'Atelier Bois & Co',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'warning',
  },
  {
    id: 3,
    type: 'payment',
    message: 'Paiement traité avec succès',
    user: 'Pierre Martin',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: 'success',
  },
  {
    id: 4,
    type: 'dispute',
    message: 'Nouveau litige ouvert',
    user: 'Sophie Laurent',
    time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    status: 'error',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-500';
    case 'warning':
      return 'bg-orange-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const RecentActivity = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.message}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.user}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(activity.time, { addSuffix: true, locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
