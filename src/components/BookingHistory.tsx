import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Ticket, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  movie_title: string;
  showtime: string;
  screen: string;
  seats: string[];
  total_amount: number;
  payment_method: string;
  booking_ref: string;
  status: string;
  created_at: string;
}

interface BookingHistoryProps {
  onBack: () => void;
}

const BookingHistory = ({ onBack }: BookingHistoryProps) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold gradient-text">Booking History</h2>
          <p className="text-sm text-muted-foreground">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg text-muted-foreground">No bookings yet</p>
          <p className="text-sm text-muted-foreground/70">Your booking history will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{booking.movie_title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{booking.showtime}</span>
                    <span>•</span>
                    <span>{booking.screen}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">Seats: {booking.seats?.join(', ') || 'N/A'}</Badge>
                    <Badge variant="outline" className="text-xs">{booking.payment_method}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                  <p className="text-lg font-bold mt-1">${Number(booking.total_amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(booking.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              {booking.booking_ref && (
                <p className="text-xs text-muted-foreground mt-2">Ref: <span className="font-mono text-primary">{booking.booking_ref}</span></p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
