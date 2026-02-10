

# CineBook Major Feature Upgrade Plan

This is a comprehensive upgrade covering admin role assignment, Tamil/Vijay movies, enhanced admin dashboard, reviews, user profiles, QR scanner, theatre search, date-based showtimes, and more.

---

## Phase 1: Database Changes (Migration)

### 1.1 Assign Admin Role
- Insert admin role for `logithvlr@gmail.com` (user ID: `64e3734b-2802-4c32-8297-53ef390bdaec`) into `user_roles` table.

### 1.2 Enhance Profiles Table
Add columns to `profiles`:
- `display_name` (text)
- `phone` (text)
- `avatar_url` (text)
- `city` (text) -- used for theatre location filtering
- `date_of_birth` (date)
- `gender` (text)
- `preferred_language` (text, default 'English')

Update the `handle_new_user` trigger to include defaults. Update RLS to allow users to insert their own profile (needed for the trigger).

### 1.3 Reviews Table
Create `reviews` table:
- `id` (uuid, PK)
- `user_id` (uuid, references auth.users)
- `movie_id` (text)
- `rating` (integer, 1-5)
- `comment` (text)
- `created_at` (timestamptz)

RLS: Users can create/read/update/delete their own reviews. Everyone can read all reviews.

### 1.4 Add Booking Date Column
Add `booking_date` (date) to `bookings` table for date-based showtime selection.

### 1.5 Admin Access to All Bookings
Add RLS policy on `bookings`: Admins can SELECT all bookings (using `has_role` function).

### 1.6 Admin Access to Profiles
Add RLS policy on `profiles`: Admins can SELECT all profiles.

---

## Phase 2: Tamil / Vijay Movies

Replace approximately 20 existing English movies (IDs 81-100) with Tamil movies, focusing on Thalapathy Vijay films:
- **GOAT (Greatest of All Time)** (2024)
- **Leo** (2023)
- **Varisu** (2023)
- **Beast** (2022)
- **Master** (2021)
- **Bigil** (2019)
- **Sarkar** (2018)
- **Mersal** (2017)
- **Theri** (2016)
- **Kaththi** (2014)
- **Jilla** (2014)
- **Thuppakki** (2012)
- **Nanban** (2012)
- **Ghilli** (2004)

Plus other popular Tamil movies:
- **Vikram** (Kamal Haasan)
- **Ponniyin Selvan** (Mani Ratnam)
- **Jailer** (Rajinikanth)
- **Kaithi** (Karthi)
- **Soorarai Pottru** (Suriya)
- **Asuran** (Dhanush)

Language will be set to "Tamil" for these entries.

---

## Phase 3: Enhanced Admin Dashboard

Completely revamp `AdminPanel.tsx` with tabs:
1. **Dashboard Overview** -- Stats cards (total users, total bookings, revenue, active theatres)
2. **Users** -- List all registered users (from profiles table), show email, city, join date
3. **Bookings** -- View ALL bookings across all users with filters (date, movie, status)
4. **Reviews** -- View all user reviews, ability to moderate
5. **Theatres & Screens** -- Existing theatre/screen management (already built)

Admin avatar (logithvlr@gmail.com photo) displayed in header. Only users with admin role see the full dashboard; others see "Access Denied."

---

## Phase 4: User Profile Page

Create `UserProfile.tsx`:
- Display and edit: display name, phone, city, date of birth, gender, preferred language, avatar URL
- City is used for auto-filtering theatres by location
- Profile accessible from the header dropdown menu

---

## Phase 5: Theatre Selection & City Filter

### 5.1 Theatre Filter by User City
- In the showtime step or a new theatre selection step, show theatres filtered by user's city from their profile
- Add a city search/filter dropdown so users can also manually search theatres by city
- Each showtime card shows which theatre it belongs to

### 5.2 Theatre Search by City
- Add a search bar in the theatre listing that filters by city name
- Available in both user-facing (during booking) and admin panel

---

## Phase 6: Date-Based Showtime Selection

- Add a date picker (using Shadcn Calendar/Popover) in the showtime step
- Default to "Today"
- Showtimes display varies by selected date (simulated with the static data, storing date in booking)
- The selected date is saved to the `booking_date` column when booking is confirmed

---

## Phase 7: Reviews System

- On movie detail (showtime step), show existing reviews and average rating
- Logged-in users can submit a star rating (1-5) + text comment
- Reviews visible on movie cards as a review count badge

---

## Phase 8: QR Code Scanner / Ticket QR

Since this is a web app, implement a **QR Code ticket generator** rather than a scanner:
- After booking confirmation, generate a QR code containing the booking reference
- Users can show this QR at the theatre for entry
- Admin panel has a "Verify Ticket" section where they can enter a booking ref to validate it

Uses a lightweight QR code generation library (qrcode.react or inline SVG generation).

---

## Phase 9: Language Filter

Add "Tamil" and other languages to the MovieList filter bar so users can filter movies by language.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| Migration SQL | Create (profiles columns, reviews table, RLS policies, admin role insert) |
| `src/data/movies.ts` | Modify (replace 20 movies with Tamil/Vijay films) |
| `src/components/AdminPanel.tsx` | Major rewrite (dashboard with users, bookings, reviews tabs) |
| `src/components/UserProfile.tsx` | Create (profile editor) |
| `src/components/ReviewSection.tsx` | Create (movie reviews display + form) |
| `src/components/TheatreSelector.tsx` | Create (theatre picker filtered by city) |
| `src/components/TicketQR.tsx` | Create (QR code generator for bookings) |
| `src/components/MovieList.tsx` | Modify (add language filter) |
| `src/components/ShowtimePicker.tsx` | Modify (add date picker) |
| `src/components/BookingConfirmation.tsx` | Modify (add QR code) |
| `src/components/Header.tsx` | Modify (add Profile link in dropdown) |
| `src/pages/Index.tsx` | Modify (add profile view, pass date to booking, theatre selection) |
| `src/types/booking.ts` | Modify (add date field to BookingState) |

---

## Technical Notes

- Admin role assignment uses a direct INSERT into `user_roles` (not a migration, since it's data)
- QR generation will use a simple inline SVG approach or the `qrcode.react` package
- Theatre city filtering uses the user's profile city as default, with manual override
- Date picker uses the existing Shadcn Calendar + Popover components (already installed: react-day-picker, date-fns)
- All admin-only data access is protected by RLS using the existing `has_role` function
- The `profiles` INSERT policy will be added so the `handle_new_user` trigger works properly

