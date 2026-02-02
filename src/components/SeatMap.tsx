import { useState, useEffect } from 'react';
import { Seat, Showtime } from '@/types/booking';
import { generateSeats } from '@/data/movies';
import { Monitor } from 'lucide-react';

interface SeatMapProps {
  showtime: Showtime;
  selectedSeats: Seat[];
  onSeatToggle: (seat: Seat) => void;
}

const SeatMap = ({ showtime, selectedSeats, onSeatToggle }: SeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    setSeats(generateSeats(showtime));
  }, [showtime]);

  const rows = [...new Set(seats.map((s) => s.row))];
  const seatsPerRow = 12;

  const getSeatStatus = (seat: Seat): 'available' | 'selected' | 'booked' => {
    if (seat.status === 'booked') return 'booked';
    if (selectedSeats.find((s) => s.id === seat.id)) return 'selected';
    return 'available';
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    onSeatToggle(seat);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Your Seats</h3>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="seat seat-available !w-6 !h-6" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat seat-selected !w-6 !h-6" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat seat-booked !w-6 !h-6" />
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat seat-premium !w-6 !h-6" />
          <span className="text-muted-foreground">Premium</span>
        </div>
      </div>

      {/* Screen */}
      <div className="relative max-w-2xl mx-auto">
        <div className="cinema-screen flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-primary/70">
            <Monitor className="w-4 h-4" />
            <span>SCREEN</span>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col gap-2 items-center min-w-max px-4">
          {rows.map((row) => {
            const rowSeats = seats.filter((s) => s.row === row);
            const isPremium = rowSeats[0]?.isPremium;

            return (
              <div key={row} className="flex items-center gap-2">
                {/* Row label */}
                <span className={`w-6 text-center text-sm font-medium ${isPremium ? 'text-cinema-gold' : 'text-muted-foreground'}`}>
                  {row}
                </span>

                {/* Seats */}
                <div className="flex gap-1.5">
                  {rowSeats.slice(0, seatsPerRow / 2).map((seat) => {
                    const status = getSeatStatus(seat);
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={status === 'booked'}
                        className={`seat ${
                          seat.isPremium ? 'seat-premium' : ''
                        } ${
                          status === 'available' && !seat.isPremium ? 'seat-available' : ''
                        } ${
                          status === 'selected' ? 'seat-selected' : ''
                        } ${
                          status === 'booked' ? 'seat-booked' : ''
                        }`}
                        title={`${seat.id} - $${seat.price}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>

                {/* Aisle gap */}
                <div className="w-8" />

                {/* Seats continued */}
                <div className="flex gap-1.5">
                  {rowSeats.slice(seatsPerRow / 2).map((seat) => {
                    const status = getSeatStatus(seat);
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={status === 'booked'}
                        className={`seat ${
                          seat.isPremium ? 'seat-premium' : ''
                        } ${
                          status === 'available' && !seat.isPremium ? 'seat-available' : ''
                        } ${
                          status === 'selected' ? 'seat-selected' : ''
                        } ${
                          status === 'booked' ? 'seat-booked' : ''
                        }`}
                        title={`${seat.id} - $${seat.price}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>

                {/* Row label */}
                <span className={`w-6 text-center text-sm font-medium ${isPremium ? 'text-cinema-gold' : 'text-muted-foreground'}`}>
                  {row}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium row indicator */}
      <p className="text-center text-sm text-muted-foreground">
        <span className="text-cinema-gold">★</span> Rows G-H are premium seats
      </p>
    </div>
  );
};

export default SeatMap;
