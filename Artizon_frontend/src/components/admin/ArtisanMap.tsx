
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const artisanLocations = [
  { city: 'Paris', count: 45, coordinates: { x: 60, y: 30 } },
  { city: 'Lyon', count: 32, coordinates: { x: 65, y: 50 } },
  { city: 'Marseille', count: 28, coordinates: { x: 70, y: 75 } },
  { city: 'Toulouse', count: 22, coordinates: { x: 45, y: 70 } },
  { city: 'Bordeaux', count: 18, coordinates: { x: 35, y: 65 } },
];

export const ArtisanMap = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Artisans par région</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          {/* Simplified France outline */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-300 text-6xl font-bold">🇫🇷</div>
          </div>
          
          {/* Artisan locations */}
          {artisanLocations.map((location, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`,
              }}
            >
              <div className="bg-[#405B35] text-white rounded-full p-2 shadow-lg group-hover:bg-[#405B35]/80 transition-colors">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {location.city}: {location.count} artisans
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
