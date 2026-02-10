import { Movie, Showtime, Seat, PaymentMethod } from '@/types/booking';
import { CheckCircle, Calendar, Clock, MapPin, Armchair, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TicketQR from './TicketQR';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  paymentMethod: PaymentMethod;
  bookingId: string;
  bookingDate?: Date | null;
  onNewBooking: () => void;
}

const BookingConfirmation = ({
  movie, showtime, seats, paymentMethod, bookingId, bookingDate, onNewBooking,
}: BookingConfirmationProps) => {
  const totalPrice = seats.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = 1.5 * seats.length;
  const grandTotal = totalPrice + convenienceFee;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cinema-success/20 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-cinema-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">Your tickets have been booked successfully</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
        <div className="absolute -left-4 top-1/2 w-8 h-8 rounded-full bg-background" />
        <div className="absolute -right-4 top-1/2 w-8 h-8 rounded-full bg-background" />

        <div className="p-6 bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="flex gap-4">
            <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded-lg shadow-lg" />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{movie.genre.join(' • ')} • {movie.duration}</p>
              <p className="text-sm text-muted-foreground">{movie.language}</p>
            </div>
          </div>
        </div>

        <div className="relative px-6"><div className="border-t-2 border-dashed border-border" /></div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{bookingDate ? format(bookingDate, 'MMM d, yyyy') : 'Today'}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div><p className="text-xs text-muted-foreground">Time</p><p className="font-medium">{showtime.time}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div><p className="text-xs text-muted-foreground">Screen</p><p className="font-medium">{showtime.screen}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Armchair className="w-5 h-5 text-primary mt-0.5" />
              <div><p className="text-xs text-muted-foreground">Seats</p><p className="font-medium">{seats.map((s) => s.id).join(', ')}</p></div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="flex justify-between items-center">
            <div><p className="text-xs text-muted-foreground">Booking ID</p><p className="font-mono font-bold text-primary">{bookingId}</p></div>
            <div className="text-right"><p className="text-xs text-muted-foreground">Paid via {paymentMethod.label}</p><p className="text-xl font-bold">${grandTotal.toFixed(2)}</p></div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-secondary/30">
          <TicketQR bookingRef={bookingId} />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" />Download Ticket</Button>
        <Button variant="outline" className="flex-1"><Share2 className="w-4 h-4 mr-2" />Share</Button>
      </div>

      <Button className="w-full mt-4 cinema-glow" size="lg" onClick={onNewBooking}>Book Another Movie</Button>
    </div>
  );
};

export default BookingConfirmation;
