
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const monthlyData = [
  { name: 'Jan', sales: 4000, previous: 3200 },
  { name: 'Fév', sales: 3000, previous: 2800 },
  { name: 'Mar', sales: 5000, previous: 4200 },
  { name: 'Avr', sales: 4500, previous: 3900 },
  { name: 'Mai', sales: 6000, previous: 5100 },
  { name: 'Jun', sales: 5500, previous: 4800 },
  { name: 'Jul', sales: 7000, previous: 6200 },
];

const weeklyData = [
  { name: 'Sem 1', sales: 1200, previous: 1100 },
  { name: 'Sem 2', sales: 1800, previous: 1400 },
  { name: 'Sem 3', sales: 1500, previous: 1300 },
  { name: 'Sem 4', sales: 2200, previous: 1900 },
];

export const SalesChart = () => {
  const [period, setPeriod] = useState('month');
  const [showComparison, setShowComparison] = useState(false);
  
  const data = period === 'month' ? monthlyData : weeklyData;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ventes par période</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={showComparison ? "default" : "outline"}
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            Comparer
          </Button>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#405B35" 
              strokeWidth={2}
              dot={{ fill: '#405B35' }}
              name="Période actuelle"
            />
            {showComparison && (
              <Line 
                type="monotone" 
                dataKey="previous" 
                stroke="#FFA500" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#FFA500' }}
                name="Période précédente"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        {showComparison && (
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#405B35]" />
              <span>Période actuelle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#FFA500] opacity-70" style={{ backgroundImage: 'repeating-linear-gradient(to right, #FFA500 0, #FFA500 3px, transparent 3px, transparent 6px)' }} />
              <span>Période précédente</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
