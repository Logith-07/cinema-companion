import { useState, useMemo } from 'react';
import { Movie, Genre } from '@/types/booking';
import { movies, genres, languages } from '@/data/movies';
import MovieCard from './MovieCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Film, Star, Heart, Globe } from 'lucide-react';

interface MovieListProps {
  onSelectMovie: (movie: Movie) => void;
  selectedMovie: Movie | null;
  showFavoritesOnly?: boolean;
  favorites?: string[];
  onToggleFavorite?: (movieId: string) => void;
  onTrailerClick?: (movie: Movie) => void;
}

const MovieList = ({ 
  onSelectMovie, 
  selectedMovie, 
  showFavoritesOnly = false,
  favorites = [],
  onToggleFavorite,
  onTrailerClick
}: MovieListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [minRating, setMinRating] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || movie.genre.includes(selectedGenre as Genre);
      const matchesRating = minRating === 'all' || movie.rating >= parseFloat(minRating);
      const matchesFavorites = !showFavoritesOnly || favorites.includes(movie.id);
      const matchesLanguage = selectedLanguage === 'all' || movie.language === selectedLanguage;
      return matchesSearch && matchesGenre && matchesRating && matchesFavorites && matchesLanguage;
    });
  }, [searchQuery, selectedGenre, minRating, showFavoritesOnly, favorites, selectedLanguage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-secondary/50 border-border" />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50"><Film className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Genre" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => <SelectItem key={genre} value={genre}>{genre}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50"><Globe className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger className="w-full sm:w-[140px] bg-secondary/50"><Star className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="7">7+</SelectItem>
            <SelectItem value="8">8+</SelectItem>
            <SelectItem value="8.5">8.5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {showFavoritesOnly && <Heart className="w-4 h-4 inline mr-1 fill-primary text-primary" />}
        Showing {filteredMovies.length} {showFavoritesOnly ? 'favorite ' : ''}movie{filteredMovies.length !== 1 ? 's' : ''}
      </p>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} isSelected={selectedMovie?.id === movie.id} isFavorite={favorites.includes(movie.id)} onToggleFavorite={onToggleFavorite} onTrailerClick={onTrailerClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          {showFavoritesOnly ? (
            <>
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground">No favorites yet</p>
              <p className="text-sm text-muted-foreground/70">Click the heart icon on movies to add favorites</p>
            </>
          ) : (
            <>
              <Film className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground">No movies found</p>
              <p className="text-sm text-muted-foreground/70">Try adjusting your filters</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieList;
