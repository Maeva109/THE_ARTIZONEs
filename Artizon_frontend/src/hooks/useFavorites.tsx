
import { useState, useEffect } from 'react';

interface FavoriteItem {
  id: number;
  type: 'product' | 'artisan' | 'tutorial';
  addedAt: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Charger les favoris depuis le localStorage au démarrage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('artizone-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('artizone-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Ajouter ou retirer un favori
  const toggleFavorite = (id: number, type: FavoriteItem['type']): boolean => {
    const existingIndex = favorites.findIndex(fav => fav.id === id && fav.type === type);
    
    if (existingIndex >= 0) {
      // Retirer des favoris
      setFavorites(prev => prev.filter((_, index) => index !== existingIndex));
      return false;
    } else {
      // Ajouter aux favoris
      const newFavorite: FavoriteItem = {
        id,
        type,
        addedAt: new Date().toISOString()
      };
      setFavorites(prev => [...prev, newFavorite]);
      return true;
    }
  };

  // Vérifier si un élément est en favori
  const isFavorite = (id: number, type: FavoriteItem['type']): boolean => {
    return favorites.some(fav => fav.id === id && fav.type === type);
  };

  // Obtenir tous les favoris d'un type spécifique
  const getFavoritesByType = (type: FavoriteItem['type']): FavoriteItem[] => {
    return favorites.filter(fav => fav.type === type);
  };

  // Obtenir le nombre total de favoris
  const getTotalFavorites = (): number => {
    return favorites.length;
  };

  // Obtenir le nombre de favoris par type
  const getFavoriteCountByType = (type: FavoriteItem['type']): number => {
    return favorites.filter(fav => fav.type === type).length;
  };

  // Vider tous les favoris
  const clearAllFavorites = (): void => {
    setFavorites([]);
  };

  // Vider les favoris d'un type spécifique
  const clearFavoritesByType = (type: FavoriteItem['type']): void => {
    setFavorites(prev => prev.filter(fav => fav.type !== type));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    getTotalFavorites,
    getFavoriteCountByType,
    clearAllFavorites,
    clearFavoritesByType
  };
};
