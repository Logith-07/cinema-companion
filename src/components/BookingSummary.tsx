import { Movie, Showtime, Seat } from '@/types/booking';
import { Ticket, Clock, MapPin, Armchair, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BookingSummaryProps {
  movie: Movie | null;
  showtime: Showtime | null;
  selectedSeats: Seat[];
  onProceed: () => void;
  buttonLabel?: string;
  disabled?: boolean;
}

const BookingSummary = ({
  movie,
  showtime,
  selectedSeats,
  onProceed,
  buttonLabel = 'Proceed to Payment',
  disabled = false,
}: BookingSummaryProps) => {
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 1.5 * selectedSeats.length : 0;
  const grandTotal = totalPrice + convenienceFee;

  return (
    <div className="glass rounded-xl p-6 sticky top-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Ticket className="w-5 h-5 text-primary" />
        Booking Summary
      </h3>

      {!movie ? (
        <p className="text-muted-foreground text-sm">Select a movie to get started</p>
      ) : (
        <div className="space-y-4">
          {/* Movie Info */}
          <div className="flex gap-3">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{movie.title}</h4>
              <p className="text-sm text-muted-foreground">{movie.language}</p>
              <p className="text-sm text-muted-foreground">{movie.duration}</p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Showtime */}
          {showtime && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{showtime.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{showtime.screen}</span>
              </div>
            </div>
          )}

          {/* Selected Seats */}
          {selectedSeats.length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Armchair className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className={`px-2 py-1 text-xs rounded-md ${
                        seat.isPremium
                          ? 'bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30'
                          : 'bg-primary/20 text-primary border border-primary/30'
                      }`}
                    >
                      {seat.id}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Price Breakdown */}
          {selectedSeats.length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets ({selectedSeats.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Convenience Fee</span>
                  <span>${convenienceFee.toFixed(2)}</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          {/* Proceed Button */}
          <Button
            className="w-full mt-4 cinema-glow"
            size="lg"
            onClick={onProceed}
            disabled={disabled || selectedSeats.length === 0}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;
