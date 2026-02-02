import { Movie, Seat } from '@/types/booking';

export const movies: Movie[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    genre: ['Sci-Fi', 'Action'],
    rating: 8.8,
    duration: '2h 46m',
    releaseYear: 2024,
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.',
    language: 'English',
    showtimes: [
      { id: 's1', time: '10:00 AM', screen: 'Screen 1', price: 12, premiumPrice: 18, available: true },
      { id: 's2', time: '1:30 PM', screen: 'Screen 2', price: 14, premiumPrice: 20, available: true },
      { id: 's3', time: '5:00 PM', screen: 'Screen 1', price: 16, premiumPrice: 22, available: true },
      { id: 's4', time: '9:00 PM', screen: 'Screen 3', price: 18, premiumPrice: 25, available: true },
    ],
  },
  {
    id: '2',
    title: 'Oppenheimer',
    genre: ['Drama', 'Thriller'],
    rating: 8.9,
    duration: '3h 0m',
    releaseYear: 2023,
    poster: 'https://images.unsplash.com/photo-1518173946687-a4c036bc3c18?w=400&h=600&fit=crop',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    language: 'English',
    showtimes: [
      { id: 's5', time: '11:00 AM', screen: 'Screen 2', price: 12, premiumPrice: 18, available: true },
      { id: 's6', time: '3:00 PM', screen: 'Screen 1', price: 14, premiumPrice: 20, available: true },
      { id: 's7', time: '7:30 PM', screen: 'Screen 3', price: 16, premiumPrice: 22, available: true },
    ],
  },
  {
    id: '3',
    title: 'Spider-Man: Across the Spider-Verse',
    genre: ['Animation', 'Action'],
    rating: 8.7,
    duration: '2h 20m',
    releaseYear: 2023,
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.',
    language: 'English',
    showtimes: [
      { id: 's8', time: '9:30 AM', screen: 'Screen 3', price: 10, premiumPrice: 15, available: true },
      { id: 's9', time: '12:00 PM', screen: 'Screen 2', price: 12, premiumPrice: 18, available: true },
      { id: 's10', time: '4:30 PM', screen: 'Screen 1', price: 14, premiumPrice: 20, available: true },
      { id: 's11', time: '8:00 PM', screen: 'Screen 2', price: 16, premiumPrice: 22, available: true },
    ],
  },
  {
    id: '4',
    title: 'The Batman',
    genre: ['Action', 'Thriller'],
    rating: 8.1,
    duration: '2h 56m',
    releaseYear: 2022,
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
    description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
    language: 'English',
    showtimes: [
      { id: 's12', time: '10:30 AM', screen: 'Screen 1', price: 11, premiumPrice: 17, available: true },
      { id: 's13', time: '2:00 PM', screen: 'Screen 3', price: 13, premiumPrice: 19, available: true },
      { id: 's14', time: '6:30 PM', screen: 'Screen 2', price: 15, premiumPrice: 21, available: true },
    ],
  },
  {
    id: '5',
    title: 'Everything Everywhere All at Once',
    genre: ['Comedy', 'Sci-Fi'],
    rating: 8.4,
    duration: '2h 19m',
    releaseYear: 2022,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    description: 'A middle-aged Chinese immigrant is swept up in an insane adventure where she alone can save existence.',
    language: 'English',
    showtimes: [
      { id: 's15', time: '11:30 AM', screen: 'Screen 2', price: 12, premiumPrice: 18, available: true },
      { id: 's16', time: '3:30 PM', screen: 'Screen 1', price: 14, premiumPrice: 20, available: true },
      { id: 's17', time: '7:00 PM', screen: 'Screen 3', price: 16, premiumPrice: 22, available: true },
    ],
  },
  {
    id: '6',
    title: 'Barbie',
    genre: ['Comedy', 'Romance'],
    rating: 7.3,
    duration: '1h 54m',
    releaseYear: 2023,
    poster: 'https://images.unsplash.com/photo-1607355739828-0bf365440db5?w=400&h=600&fit=crop',
    description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
    language: 'English',
    showtimes: [
      { id: 's18', time: '10:00 AM', screen: 'Screen 3', price: 10, premiumPrice: 15, available: true },
      { id: 's19', time: '1:00 PM', screen: 'Screen 2', price: 12, premiumPrice: 18, available: true },
      { id: 's20', time: '4:00 PM', screen: 'Screen 1', price: 14, premiumPrice: 20, available: true },
      { id: 's21', time: '7:30 PM', screen: 'Screen 3', price: 16, premiumPrice: 22, available: true },
    ],
  },
];

export const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

export const generateSeats = (showtime: { price: number; premiumPrice: number }): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const premiumRows = ['G', 'H'];
  const seats: Seat[] = [];

  // Pre-book some random seats
  const bookedSeats = new Set<string>();
  const numberOfBookedSeats = Math.floor(Math.random() * 20) + 10;
  
  for (let i = 0; i < numberOfBookedSeats; i++) {
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const randomSeat = Math.floor(Math.random() * seatsPerRow) + 1;
    bookedSeats.add(`${randomRow}${randomSeat}`);
  }

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const isPremium = premiumRows.includes(row);
      const seatId = `${row}${i}`;
      seats.push({
        id: seatId,
        row,
        number: i,
        status: bookedSeats.has(seatId) ? 'booked' : 'available',
        isPremium,
        price: isPremium ? showtime.premiumPrice : showtime.price,
      });
    }
  });

  return seats;
};

export const paymentMethods = [
  { id: 'credit', type: 'credit' as const, label: 'Credit Card', icon: 'CreditCard' },
  { id: 'debit', type: 'debit' as const, label: 'Debit Card', icon: 'CreditCard' },
  { id: 'wallet', type: 'wallet' as const, label: 'Digital Wallet', icon: 'Wallet' },
  { id: 'upi', type: 'upi' as const, label: 'UPI', icon: 'Smartphone' },
];
