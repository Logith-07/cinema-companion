import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('movie_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } else {
      setFavorites(data?.map((f) => f.movie_id) || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (movieId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    const isFavorite = favorites.includes(movieId);

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) {
        console.error('Error removing favorite:', error);
        toast.error('Failed to remove from favorites');
      } else {
        setFavorites((prev) => prev.filter((id) => id !== movieId));
        toast.success('Removed from favorites');
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, movie_id: movieId });

      if (error) {
        console.error('Error adding favorite:', error);
        toast.error('Failed to add to favorites');
      } else {
        setFavorites((prev) => [...prev, movieId]);
        toast.success('Added to favorites');
      }
    }
  };

  const isFavorite = (movieId: string) => favorites.includes(movieId);

  return { favorites, loading, toggleFavorite, isFavorite };
};
