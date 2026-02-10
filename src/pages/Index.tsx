import { useState } from 'react';
import { Movie, Showtime, Seat, PaymentMethod, BookingState } from '@/types/booking';
import MovieList from '@/components/MovieList';
import ShowtimePicker from '@/components/ShowtimePicker';
import SeatMap from '@/components/SeatMap';
import BookingSummary from '@/components/BookingSummary';
import PaymentForm from '@/components/PaymentForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import Header from '@/components/Header';
import TrailerModal from '@/components/TrailerModal';
import AdminPanel from '@/components/AdminPanel';
import BookingHistory from '@/components/BookingHistory';
import UserProfile from '@/components/UserProfile';
import ReviewSection from '@/components/ReviewSection';
import TheatreSelector from '@/components/TheatreSelector';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Ticket, Film, Armchair, CreditCard, CheckCircle } from 'lucide-react';
import heroCinema from '@/assets/hero-cinema.jpg';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const Index = () => {
  const { user } = useAuth();
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedMovie: null,
    selectedShowtime: null,
    selectedSeats: [],
    selectedDate: null,
    step: 'movies',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [bookingId, setBookingId] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [view, setView] = useState<'main' | 'admin' | 'history' | 'profile'>('main');

  const handleSelectMovie = (movie: Movie) => {
    setBookingState({ ...bookingState, selectedMovie: movie, selectedShowtime: null, selectedSeats: [], step: 'showtime' });
  };

  const handleTrailerClick = (movie: Movie) => {
    setTrailerMovie(movie);
    setTrailerOpen(true);
  };

  const handleSelectShowtime = (showtime: Showtime) => {
    setBookingState({ ...bookingState, selectedShowtime: showtime, selectedSeats: [], step: 'seats' });
  };

  const handleSeatToggle = (seat: Seat) => {
    const isSelected = bookingState.selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      setBookingState({ ...bookingState, selectedSeats: bookingState.selectedSeats.filter((s) => s.id !== seat.id) });
    } else {
      if (bookingState.selectedSeats.length >= 10) return;
      setBookingState({ ...bookingState, selectedSeats: [...bookingState.selectedSeats, seat] });
    }
  };

  const handleProceedToPayment = () => {
    setBookingState({ ...bookingState, step: 'payment' });
  };

  const handlePaymentComplete = async (method: PaymentMethod) => {
    const ref = `CB${Date.now().toString().slice(-8)}`;
    setPaymentMethod(method);
    setBookingId(ref);

    if (user && bookingState.selectedMovie && bookingState.selectedShowtime) {
      await supabase.from('bookings').insert({
        user_id: user.id,
        movie_id: bookingState.selectedMovie.id,
        movie_title: bookingState.selectedMovie.title,
        showtime: bookingState.selectedShowtime.time,
        screen: bookingState.selectedShowtime.screen,
        seats: bookingState.selectedSeats.map(s => s.id),
        total_amount: bookingState.selectedSeats.reduce((sum, s) => sum + s.price, 0) + 1.5 * bookingState.selectedSeats.length,
        payment_method: method.label,
        booking_ref: ref,
        status: 'confirmed',
        booking_date: bookingState.selectedDate ? format(bookingState.selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      } as any);
    }

    setBookingState({ ...bookingState, step: 'confirmation' });
  };

  const handleNewBooking = () => {
    setBookingState({ selectedMovie: null, selectedShowtime: null, selectedSeats: [], selectedDate: null, step: 'movies' });
    setPaymentMethod(null);
    setBookingId('');
  };

  const goBack = () => {
    switch (bookingState.step) {
      case 'showtime': setBookingState({ ...bookingState, step: 'movies', selectedMovie: null }); break;
      case 'seats': setBookingState({ ...bookingState, step: 'showtime', selectedShowtime: null, selectedSeats: [] }); break;
      case 'payment': setBookingState({ ...bookingState, step: 'seats' }); break;
    }
  };

  const totalPrice = bookingState.selectedSeats.reduce((sum, seat) => sum + seat.price, 0) + 1.5 * bookingState.selectedSeats.length;

  const steps = [
    { id: 'movies', label: 'Movie', icon: Film },
    { id: 'showtime', label: 'Showtime', icon: Ticket },
    { id: 'seats', label: 'Seats', icon: Armchair },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Done', icon: CheckCircle },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === bookingState.step);

  const headerProps = {
    showFavoritesOnly,
    onToggleFavorites: () => setShowFavoritesOnly(!showFavoritesOnly),
    onOpenAdmin: () => setView('admin'),
    onOpenHistory: () => setView('history'),
    onOpenProfile: () => setView('profile'),
  };

  if (view === 'admin') return (
    <div className="min-h-screen bg-background">
      <Header {...headerProps} />
      <main className="container max-w-5xl py-6 md:py-12"><AdminPanel onBack={() => setView('main')} /></main>
    </div>
  );

  if (view === 'history') return (
    <div className="min-h-screen bg-background">
      <Header {...headerProps} />
      <main className="container max-w-5xl py-6 md:py-12"><BookingHistory onBack={() => setView('main')} /></main>
    </div>
  );

  if (view === 'profile') return (
    <div className="min-h-screen bg-background">
      <Header {...headerProps} />
      <main className="container max-w-5xl py-6 md:py-12"><UserProfile onBack={() => setView('main')} /></main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header {...headerProps} />

      {bookingState.step === 'movies' && (
        <div className="relative h-[35vh] md:h-[45vh] overflow-hidden">
          <img src={heroCinema} alt="Cinema experience" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container max-w-7xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-2 gradient-text">Book Your Experience</h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">Select your seats. Enjoy the show.</p>
            </div>
          </div>
        </div>
      )}

      {bookingState.step !== 'movies' && bookingState.step !== 'confirmation' && (
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container max-w-7xl py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Button variant="ghost" size="sm" onClick={goBack} className="shrink-0"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
              <div className="flex items-center gap-2 ml-auto">
                {steps.slice(0, -1).map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === bookingState.step;
                  const isCompleted = index < currentStepIndex;
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${isActive ? 'bg-primary text-primary-foreground' : isCompleted ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        <Icon className="w-4 h-4" /><span className="hidden sm:inline">{step.label}</span>
                      </div>
                      {index < steps.length - 2 && <div className={`w-8 h-0.5 mx-1 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container max-w-7xl py-6 md:py-12">
        {bookingState.step === 'movies' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Now Showing</h2>
            <MovieList onSelectMovie={handleSelectMovie} selectedMovie={bookingState.selectedMovie} showFavoritesOnly={showFavoritesOnly} favorites={favorites} onToggleFavorite={toggleFavorite} onTrailerClick={handleTrailerClick} />
          </div>
        )}

        {bookingState.step === 'showtime' && bookingState.selectedMovie && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex gap-6">
                <img src={bookingState.selectedMovie.poster} alt={bookingState.selectedMovie.title} className="w-32 md:w-40 h-auto object-cover rounded-xl shadow-lg" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{bookingState.selectedMovie.title}</h2>
                  <p className="text-muted-foreground mb-4">{bookingState.selectedMovie.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {bookingState.selectedMovie.genre.map((g) => (
                      <span key={g} className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground">{g}</span>
                    ))}
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary">{bookingState.selectedMovie.language}</span>
                  </div>
                </div>
              </div>
              <ShowtimePicker
                showtimes={bookingState.selectedMovie.showtimes}
                selectedShowtime={bookingState.selectedShowtime}
                onSelectShowtime={handleSelectShowtime}
                selectedDate={bookingState.selectedDate}
                onDateChange={(d) => setBookingState({ ...bookingState, selectedDate: d })}
              />
              <ReviewSection movieId={bookingState.selectedMovie.id} />
            </div>
            <div>
              <BookingSummary movie={bookingState.selectedMovie} showtime={bookingState.selectedShowtime} selectedSeats={bookingState.selectedSeats} onProceed={() => {}} buttonLabel="Select Showtime First" disabled={!bookingState.selectedShowtime} />
            </div>
          </div>
        )}

        {bookingState.step === 'seats' && bookingState.selectedMovie && bookingState.selectedShowtime && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2">
              <SeatMap showtime={bookingState.selectedShowtime} selectedSeats={bookingState.selectedSeats} onSeatToggle={handleSeatToggle} />
              {bookingState.selectedSeats.length > 0 && <p className="text-center text-sm text-muted-foreground mt-4">Selected {bookingState.selectedSeats.length} of 10 maximum seats</p>}
            </div>
            <div><BookingSummary movie={bookingState.selectedMovie} showtime={bookingState.selectedShowtime} selectedSeats={bookingState.selectedSeats} onProceed={handleProceedToPayment} disabled={bookingState.selectedSeats.length === 0} /></div>
          </div>
        )}

        {bookingState.step === 'payment' && bookingState.selectedMovie && bookingState.selectedShowtime && (
          <div className="max-w-2xl mx-auto"><PaymentForm totalAmount={totalPrice} onPaymentComplete={handlePaymentComplete} onBack={goBack} /></div>
        )}

        {bookingState.step === 'confirmation' && bookingState.selectedMovie && bookingState.selectedShowtime && paymentMethod && (
          <BookingConfirmation movie={bookingState.selectedMovie} showtime={bookingState.selectedShowtime} seats={bookingState.selectedSeats} paymentMethod={paymentMethod} bookingId={bookingId} bookingDate={bookingState.selectedDate} onNewBooking={handleNewBooking} />
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container max-w-7xl py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 CineBook. All rights reserved.</p>
          <p className="mt-1">Your premium movie booking experience.</p>
        </div>
      </footer>

      <TrailerModal movie={trailerMovie} open={trailerOpen} onOpenChange={setTrailerOpen} />
    </div>
  );
};

export default Index;
