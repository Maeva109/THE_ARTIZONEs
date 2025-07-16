
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Wifi, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const alerts = [
  {
    id: 1,
    type: 'critical',
    icon: AlertTriangle,
    title: 'Problème de synchronisation API',
    description: 'La synchronisation avec le système de paiement est interrompue depuis 15 minutes.',
    action: 'Vérifier la connexion',
    time: '15 min'
  },
  {
    id: 2,
    type: 'warning',
    icon: Shield,
    title: 'Tentative d\'accès suspect',
    description: '3 tentatives de connexion échouées sur le compte admin.',
    action: 'Voir les détails',
    time: '1h'
  },
  {
    id: 3,
    type: 'info',
    icon: Wifi,
    title: 'Maintenance programmée',
    description: 'Maintenance du serveur prévue demain à 3h00.',
    action: 'Planifier',
    time: '2h'
  }
];

export const SystemAlerts = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Alertes Système Critiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <Alert key={alert.id} className={`border-l-4 ${
            alert.type === 'critical' ? 'border-l-red-500 bg-red-50' :
            alert.type === 'warning' ? 'border-l-orange-500 bg-orange-50' :
            'border-l-blue-500 bg-blue-50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <alert.icon className={`h-4 w-4 mt-1 ${
                  alert.type === 'critical' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-orange-500' :
                  'text-blue-500'
                }`} />
                <div>
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <AlertDescription className="text-xs text-gray-600 mt-1">
                    {alert.description}
                  </AlertDescription>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-500">{alert.time}</span>
                <Button variant="outline" size="sm" className="text-xs">
                  {alert.action}
                </Button>
              </div>
            </div>
          </Alert>
        ))}
        <Button variant="ghost" className="w-full text-sm">
          Voir toutes les alertes
        </Button>
      </CardContent>
    </Card>
  );
};
