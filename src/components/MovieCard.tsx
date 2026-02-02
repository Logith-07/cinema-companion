import { Movie } from '@/types/booking';
import { Star, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  isSelected?: boolean;
}

const MovieCard = ({ movie, onSelect, isSelected }: MovieCardProps) => {
  return (
    <div
      onClick={() => onSelect(movie)}
      className={`movie-card relative overflow-hidden rounded-xl bg-card cursor-pointer group ${
        isSelected ? 'ring-2 ring-primary cinema-glow' : 'hover:ring-1 hover:ring-primary/50'
      }`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm">
          <Star className="w-4 h-4 text-cinema-gold fill-cinema-gold" />
          <span className="text-sm font-semibold">{movie.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{movie.title}</h3>
        
        {/* Genres */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {movie.genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{movie.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{movie.releaseYear}</span>
          </div>
        </div>

        {/* Language */}
        <p className="text-xs text-muted-foreground mt-2">{movie.language}</p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
      )}
    </div>
  );
};

export default MovieCard;
