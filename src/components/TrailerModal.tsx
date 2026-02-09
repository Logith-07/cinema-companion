import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Movie } from '@/types/booking';
import { Play } from 'lucide-react';

interface TrailerModalProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrailerModal = ({ movie, open, onOpenChange }: TrailerModalProps) => {
  if (!movie) return null;

  const hasTrailer = movie.trailerUrl && movie.trailerUrl.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl">{movie.title} — Trailer</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          {hasTrailer ? (
            <iframe
              src={`${movie.trailerUrl}?autoplay=1`}
              title={`${movie.title} Trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50 gap-4">
              <Play className="w-16 h-16 text-muted-foreground" />
              <p className="text-muted-foreground">Trailer not available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
