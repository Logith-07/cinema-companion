import { useState } from 'react';
import { Movie, Showtime, Seat, PaymentMethod, BookingState } from '@/types/booking';
import MovieList from '@/components/MovieList';
import ShowtimePicker from '@/components/ShowtimePicker';
import SeatMap from '@/components/SeatMap';
import BookingSummary from '@/components/BookingSummary';
import PaymentForm from '@/components/PaymentForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Ticket, Film, Armchair, CreditCard, CheckCircle } from 'lucide-react';
import heroCinema from '@/assets/hero-cinema.jpg';

const Index = () => {
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedMovie: null,
    selectedShowtime: null,
    selectedSeats: [],
    step: 'movies',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [bookingId, setBookingId] = useState('');

  const handleSelectMovie = (movie: Movie) => {
    setBookingState({
      ...bookingState,
      selectedMovie: movie,
      selectedShowtime: null,
      selectedSeats: [],
      step: 'showtime',
    });
  };

  const handleSelectShowtime = (showtime: Showtime) => {
    setBookingState({
      ...bookingState,
      selectedShowtime: showtime,
      selectedSeats: [],
      step: 'seats',
    });
  };

  const handleSeatToggle = (seat: Seat) => {
    const isSelected = bookingState.selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      setBookingState({
        ...bookingState,
        selectedSeats: bookingState.selectedSeats.filter((s) => s.id !== seat.id),
      });
    } else {
      if (bookingState.selectedSeats.length >= 10) {
        return; // Max 10 seats
      }
      setBookingState({
        ...bookingState,
        selectedSeats: [...bookingState.selectedSeats, seat],
      });
    }
  };

  const handleProceedToPayment = () => {
    setBookingState({ ...bookingState, step: 'payment' });
  };

  const handlePaymentComplete = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setBookingId(`CB${Date.now().toString().slice(-8)}`);
    setBookingState({ ...bookingState, step: 'confirmation' });
  };

  const handleNewBooking = () => {
    setBookingState({
      selectedMovie: null,
      selectedShowtime: null,
      selectedSeats: [],
      step: 'movies',
    });
    setPaymentMethod(null);
    setBookingId('');
  };

  const goBack = () => {
    switch (bookingState.step) {
      case 'showtime':
        setBookingState({ ...bookingState, step: 'movies', selectedMovie: null });
        break;
      case 'seats':
        setBookingState({ ...bookingState, step: 'showtime', selectedShowtime: null, selectedSeats: [] });
        break;
      case 'payment':
        setBookingState({ ...bookingState, step: 'seats' });
        break;
    }
  };

  const totalPrice =
    bookingState.selectedSeats.reduce((sum, seat) => sum + seat.price, 0) +
    1.5 * bookingState.selectedSeats.length;

  const steps = [
    { id: 'movies', label: 'Movie', icon: Film },
    { id: 'showtime', label: 'Showtime', icon: Ticket },
    { id: 'seats', label: 'Seats', icon: Armchair },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Done', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === bookingState.step);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {bookingState.step === 'movies' && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={heroCinema}
            alt="Cinema experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container max-w-7xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-2 gradient-text">
                CineBook
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Book your movie experience. Select your seats. Enjoy the show.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      {bookingState.step !== 'movies' && bookingState.step !== 'confirmation' && (
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container max-w-7xl py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="shrink-0"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <div className="flex items-center gap-2 ml-auto">
                {steps.slice(0, -1).map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === bookingState.step;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : isCompleted
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{step.label}</span>
                      </div>
                      {index < steps.length - 2 && (
                        <div
                          className={`w-8 h-0.5 mx-1 ${
                            isCompleted ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container max-w-7xl py-6 md:py-12">
        {/* Movie Selection */}
        {bookingState.step === 'movies' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Now Showing</h2>
            <MovieList
              onSelectMovie={handleSelectMovie}
              selectedMovie={bookingState.selectedMovie}
            />
          </div>
        )}

        {/* Showtime Selection */}
        {bookingState.step === 'showtime' && bookingState.selectedMovie && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-8">
              {/* Movie Details */}
              <div className="flex gap-6">
                <img
                  src={bookingState.selectedMovie.poster}
                  alt={bookingState.selectedMovie.title}
                  className="w-32 md:w-40 h-auto object-cover rounded-xl shadow-lg"
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {bookingState.selectedMovie.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {bookingState.selectedMovie.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bookingState.selectedMovie.genre.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <ShowtimePicker
                showtimes={bookingState.selectedMovie.showtimes}
                selectedShowtime={bookingState.selectedShowtime}
                onSelectShowtime={handleSelectShowtime}
              />
            </div>

            <div>
              <BookingSummary
                movie={bookingState.selectedMovie}
                showtime={bookingState.selectedShowtime}
                selectedSeats={bookingState.selectedSeats}
                onProceed={() => {}}
                buttonLabel="Select Showtime First"
                disabled={!bookingState.selectedShowtime}
              />
            </div>
          </div>
        )}

        {/* Seat Selection */}
        {bookingState.step === 'seats' &&
          bookingState.selectedMovie &&
          bookingState.selectedShowtime && (
            <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2">
                <SeatMap
                  showtime={bookingState.selectedShowtime}
                  selectedSeats={bookingState.selectedSeats}
                  onSeatToggle={handleSeatToggle}
                />
                {bookingState.selectedSeats.length > 0 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Selected {bookingState.selectedSeats.length} of 10 maximum seats
                  </p>
                )}
              </div>

              <div>
                <BookingSummary
                  movie={bookingState.selectedMovie}
                  showtime={bookingState.selectedShowtime}
                  selectedSeats={bookingState.selectedSeats}
                  onProceed={handleProceedToPayment}
                  disabled={bookingState.selectedSeats.length === 0}
                />
              </div>
            </div>
          )}

        {/* Payment */}
        {bookingState.step === 'payment' &&
          bookingState.selectedMovie &&
          bookingState.selectedShowtime && (
            <div className="max-w-2xl mx-auto">
              <PaymentForm
                totalAmount={totalPrice}
                onPaymentComplete={handlePaymentComplete}
                onBack={goBack}
              />
            </div>
          )}

        {/* Confirmation */}
        {bookingState.step === 'confirmation' &&
          bookingState.selectedMovie &&
          bookingState.selectedShowtime &&
          paymentMethod && (
            <BookingConfirmation
              movie={bookingState.selectedMovie}
              showtime={bookingState.selectedShowtime}
              seats={bookingState.selectedSeats}
              paymentMethod={paymentMethod}
              bookingId={bookingId}
              onNewBooking={handleNewBooking}
            />
          )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container max-w-7xl py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 CineBook. All rights reserved.</p>
          <p className="mt-1">Your premium movie booking experience.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
