import { useState } from 'react';
import { Showtime } from '@/types/booking';
import { Clock, Monitor, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ShowtimePickerProps {
  showtimes: Showtime[];
  selectedShowtime: Showtime | null;
  onSelectShowtime: (showtime: Showtime) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

const ShowtimePicker = ({ showtimes, selectedShowtime, onSelectShowtime, selectedDate, onDateChange }: ShowtimePickerProps) => {
  const today = new Date();
  const displayDate = selectedDate || today;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Select Showtime
        </h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              {format(displayDate, 'MMM d, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={displayDate}
              onSelect={(d) => d && onDateChange(d)}
              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {showtimes.map((showtime) => (
          <Button
            key={showtime.id}
            variant={selectedShowtime?.id === showtime.id ? 'default' : 'outline'}
            className={`h-auto py-4 flex flex-col gap-1 transition-all ${
              selectedShowtime?.id === showtime.id ? 'cinema-glow' : 'hover:border-primary/50'
            }`}
            onClick={() => onSelectShowtime(showtime)}
            disabled={!showtime.available}
          >
            <span className="text-lg font-bold">{showtime.time}</span>
            <div className="flex items-center gap-1 text-xs opacity-70">
              <Monitor className="w-3 h-3" />
              <span>{showtime.screen}</span>
            </div>
            <span className="text-xs">From ${showtime.price}</span>
          </Button>
        ))}
      </div>

      {selectedShowtime && (
        <div className="mt-4 p-4 rounded-lg bg-secondary/50 animate-fade-in">
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="text-muted-foreground">Standard Seats</p>
              <p className="font-semibold">${selectedShowtime.price}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Premium Seats</p>
              <p className="font-semibold text-cinema-gold">${selectedShowtime.premiumPrice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimePicker;
