
-- RBAC system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Theatres table
CREATE TABLE public.theatres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  city text NOT NULL DEFAULT '',
  amenities text[] DEFAULT '{}',
  contact_phone text,
  contact_email text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.theatres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active theatres"
ON public.theatres FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage theatres"
ON public.theatres FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Screens table
CREATE TABLE public.screens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theatre_id uuid REFERENCES public.theatres(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  screen_type text NOT NULL DEFAULT 'Standard',
  total_seats integer NOT NULL DEFAULT 96,
  seat_rows integer NOT NULL DEFAULT 8,
  seats_per_row integer NOT NULL DEFAULT 12,
  premium_rows text[] DEFAULT '{"G","H"}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active screens"
ON public.screens FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage screens"
ON public.screens FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  movie_id text NOT NULL,
  movie_title text NOT NULL,
  showtime text NOT NULL,
  screen text NOT NULL,
  seats text[] NOT NULL DEFAULT '{}',
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'credit',
  booking_ref text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Insert 15 theatres
INSERT INTO public.theatres (name, location, city, amenities, contact_phone) VALUES
('CineMax Central', '123 Main Street', 'Mumbai', '{"IMAX","Dolby Atmos","Parking","Food Court"}', '+91-22-1234-5678'),
('StarPlex Mall', '456 Mall Road', 'Delhi', '{"4DX","Recliner Seats","Valet Parking"}', '+91-11-2345-6789'),
('Galaxy Cinemas', '789 Park Avenue', 'Bangalore', '{"IMAX","Premium Lounge","Bar"}', '+91-80-3456-7890'),
('Metro Movies', '321 Station Road', 'Chennai', '{"Dolby Atmos","Wheelchair Access","Cafe"}', '+91-44-4567-8901'),
('Royal Cinema', '654 Palace Road', 'Hyderabad', '{"Gold Class","Valet Parking","Restaurant"}', '+91-40-5678-9012'),
('Silver Screen', '987 Lake View', 'Pune', '{"IMAX","Parking","Snack Bar"}', '+91-20-6789-0123'),
('Diamond Theatre', '147 Hill Road', 'Kolkata', '{"4DX","Premium Seats","Lounge"}', '+91-33-7890-1234'),
('Platinum Cineplex', '258 Beach Road', 'Goa', '{"Dolby Atmos","Outdoor Seating","Bar"}', '+91-83-8901-2345'),
('Golden Movies', '369 Garden Street', 'Ahmedabad', '{"IMAX","Food Court","Parking"}', '+91-79-9012-3456'),
('Crystal Cinema', '741 River Road', 'Jaipur', '{"Recliner Seats","Cafe","Kids Zone"}', '+91-14-0123-4567'),
('Emerald Screens', '852 Market Street', 'Lucknow', '{"Standard","Parking","Snack Bar"}', '+91-52-1234-5678'),
('Sapphire Theatre', '963 College Road', 'Chandigarh', '{"Dolby Atmos","Premium Lounge"}', '+91-17-2345-6789'),
('Ruby Cinemas', '159 Temple Street', 'Kochi', '{"4DX","Restaurant","Parking"}', '+91-48-3456-7890'),
('Pearl Movies', '267 Fort Road', 'Indore', '{"IMAX","Cafe","Wheelchair Access"}', '+91-73-4567-8901'),
('Topaz Cineplex', '375 Tech Park', 'Noida', '{"Dolby Atmos","Recliner Seats","Food Court","Parking"}', '+91-12-5678-9012');

-- Insert screens for each theatre (2-3 screens each)
INSERT INTO public.screens (theatre_id, name, screen_type, total_seats, seat_rows, seats_per_row, premium_rows)
SELECT t.id, s.name, s.screen_type, s.total_seats, s.seat_rows, s.seats_per_row, s.premium_rows
FROM public.theatres t
CROSS JOIN (VALUES
  ('Screen 1', 'IMAX', 150, 10, 15, ARRAY['I','J']),
  ('Screen 2', 'Standard', 96, 8, 12, ARRAY['G','H']),
  ('Screen 3', '4DX', 60, 6, 10, ARRAY['E','F'])
) AS s(name, screen_type, total_seats, seat_rows, seats_per_row, premium_rows)
WHERE t.name IN ('CineMax Central', 'StarPlex Mall', 'Galaxy Cinemas', 'Royal Cinema', 'Platinum Cineplex');

INSERT INTO public.screens (theatre_id, name, screen_type, total_seats, seat_rows, seats_per_row, premium_rows)
SELECT t.id, s.name, s.screen_type, s.total_seats, s.seat_rows, s.seats_per_row, s.premium_rows
FROM public.theatres t
CROSS JOIN (VALUES
  ('Screen 1', 'Dolby Atmos', 120, 10, 12, ARRAY['I','J']),
  ('Screen 2', 'Standard', 96, 8, 12, ARRAY['G','H'])
) AS s(name, screen_type, total_seats, seat_rows, seats_per_row, premium_rows)
WHERE t.name NOT IN ('CineMax Central', 'StarPlex Mall', 'Galaxy Cinemas', 'Royal Cinema', 'Platinum Cineplex');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_theatres_updated_at BEFORE UPDATE ON public.theatres
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_screens_updated_at BEFORE UPDATE ON public.screens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
