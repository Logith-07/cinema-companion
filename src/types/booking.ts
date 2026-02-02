export interface Movie {
  id: string;
  title: string;
  genre: string[];
  rating: number;
  duration: string;
  releaseYear: number;
  poster: string;
  description: string;
  language: string;
  showtimes: Showtime[];
}

export interface Showtime {
  id: string;
  time: string;
  screen: string;
  price: number;
  premiumPrice: number;
  available: boolean;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
  isPremium: boolean;
  price: number;
}

export interface BookingState {
  selectedMovie: Movie | null;
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  step: 'movies' | 'showtime' | 'seats' | 'payment' | 'confirmation';
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'wallet' | 'upi';
  label: string;
  icon: string;
}

export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Horror' | 'Sci-Fi' | 'Romance' | 'Thriller' | 'Animation';
