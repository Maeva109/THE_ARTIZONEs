import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Filters {
  category: string;
  priceRange: number[];
  artisan: string;
  location: string;
  promotions: boolean;
  nouveautes: boolean;
  search: string;
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const ProductFilters = ({ filters, onFilterChange }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(() => setCategories([]));
  }, []);

  // Départements de la région de l'Ouest du Cameroun
  const departments = [
    'Bamboutos',
    'Haut-Nkam',
    'Hauts-Plateaux', 
    'Koung-Khi',
    'Menoua',
    'Mifi',
    'Noun',
    'Ndé'
  ];

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filters,
      category: categoryId === 'all' ? '' : categoryId
    });
  };

  const handleDepartmentChange = (department: string) => {
    // Handle the special "all" value
    const newLocation = department === 'all-departments' ? '' : department;
    onFilterChange({
      ...filters,
      location: newLocation
    });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: value
    });
  };

  const handlePromotionsChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      promotions: checked
    });
  };

  const handleNouveautesChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      nouveautes: checked
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      priceRange: [0, 100000],
      artisan: '',
      location: '',
      promotions: false,
      nouveautes: false,
      search: '',
    });
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full border-[#405B35] text-[#405B35]"
        >
          Filtres {isOpen ? '×' : '☰'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Rechercher un produit ou un artisan..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      {/* Filters Panel */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#405B35] flex justify-between items-center">
              Filtres
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-[#405B35]"
              >
                Effacer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories - Buttons/Tags */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Catégories
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  key="all"
                  variant={filters.category === '' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange('all')}
                  className={`${
                    filters.category === ''
                      ? 'bg-[#405B35] text-white'
                      : 'border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white'
                  }`}
                >
                  Toutes
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id || 'all'}
                    variant={filters.category === (category.id ? String(category.id) : '') ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category.id ? String(category.id) : 'all')}
                    className={`${
                      filters.category === (category.id ? String(category.id) : '')
                        ? 'bg-[#405B35] text-white' 
                        : 'border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white'
                    }`}
                  >
                    {category.name || 'Tout'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range - Slider */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Prix (FCFA)
              </Label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceChange}
                  max={100000}
                  min={0}
                  step={1000}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{filters.priceRange[0].toLocaleString()}</span>
                  <span>{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Artisan Search */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Artisan
              </Label>
              <Input
                placeholder="Nom de l'artisan ou boutique"
                value={filters.artisan}
                onChange={(e) => onFilterChange({ ...filters, artisan: e.target.value })}
                className="focus:border-[#405B35] focus:ring-[#405B35]"
              />
            </div>

            {/* Département - Dropdown with proper values */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Département (Région de l'Ouest)
              </Label>
              <Select 
                value={filters.location || 'all-departments'} 
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="focus:border-[#405B35] focus:ring-[#405B35]">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Special Offers - Checkboxes */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Offres spéciales
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="promotions"
                    checked={filters.promotions}
                    onCheckedChange={handlePromotionsChange}
                  />
                  <Label 
                    htmlFor="promotions"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    En promotion
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nouveautes"
                    checked={filters.nouveautes}
                    onCheckedChange={handleNouveautesChange}
                  />
                  <Label 
                    htmlFor="nouveautes"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Nouveautés
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
