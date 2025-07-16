
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, CreditCard, MessageSquare } from 'lucide-react';

const quickActions = [
  {
    title: 'Valider nouveaux produits',
    count: 12,
    icon: CheckCircle,
    color: 'bg-green-500',
    action: 'Valider',
  },
  {
    title: 'Valider nouveaux artisans',
    count: 5,
    icon: CheckCircle,
    color: 'bg-blue-500',
    action: 'Valider',
  },
  {
    title: 'Paiements en attente',
    count: 8,
    icon: CreditCard,
    color: 'bg-orange-500',
    action: 'Gérer',
  },
  {
    title: 'Modérer les avis',
    count: 15,
    icon: MessageSquare,
    color: 'bg-purple-500',
    action: 'Modérer',
  },
];

export const QuickActions = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <Badge variant="secondary" className="mt-1">
                    {action.count} en attente
                  </Badge>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-[#405B35] hover:bg-[#405B35]/90"
              >
                {action.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
