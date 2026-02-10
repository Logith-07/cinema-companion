
-- Phase 1.2: Enhance profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'English';

-- Phase 1.3: Reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Phase 1.4: Booking date column
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_date date;

-- Phase 1.5: Admin access to all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Phase 1.6: Admin access to profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Allow profile INSERT for trigger
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Update handle_new_user trigger to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, preferred_language)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1), 'English');
  RETURN NEW;
END;
$$;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
