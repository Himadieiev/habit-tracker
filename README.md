<div align="center">
  <h1 align="center">Habit Tracker</h1>

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-React_Router-black?style=for-the-badge&logoColor=white&logo=reactrouter&color=CA4245" alt="react-router" />
    <img src="https://img.shields.io/badge/-Supabase-black?style=for-the-badge&logoColor=white&logo=supabase&color=3FCF8E" alt="supabase" />
    <img src="https://img.shields.io/badge/-SCSS-black?style=for-the-badge&logoColor=white&logo=sass&color=CC6699" alt="sass" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="vite" />
    <img src="https://img.shields.io/badge/-Recharts-black?style=for-the-badge&logoColor=white&logo=recharts&color=22B5BF" alt="recharts" />
  </div>

</div>

## About

Habit Tracker is a full-featured habit tracking application that helps users build and maintain daily routines. With intuitive UI, detailed analytics, and seamless Google authentication, it makes habit tracking effortless and engaging.

## Features

- **Google Authentication** — Secure OAuth login with Supabase Auth
- **Habit Management** — Create, edit, delete, and reorder habits with drag-and-drop
- **Daily Tracking** — Mark habits as complete with visual feedback and streak counting
- **Detailed Statistics** — Personal dashboard with completion rates, best streaks, and activity heatmap
- **GitHub-Style Activity Calendar** — Visual representation of your 30-day habit history
- **Weekday Performance Chart** — See which days of the week you're most productive
- **Data Export/Import** — Backup and restore your habit data as JSON
- **Profile Management** — View account statistics, export data, or delete all habits
- **Responsive Design** — Fully functional on desktop, tablet, and mobile devices
- **Toast Notifications** — Clear feedback for all user actions with sonner
- **Real-time UI Updates** — Optimistic updates for smooth user experience

## Tech Stack

- **Frontend**: React 19, TypeScript, React Router 7
- **Styling**: SCSS with CSS variables
- **Backend & Auth**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Charts**: Recharts
- **Build Tool**: Vite
- **Utilities**: classnames, sonner

## Database Schema

```sql
-- Habits table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamp with time zone default now(),
  "order" bigint
);

-- Habit logs table
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references habits(id) on delete cascade,
  date date not null,
  completed boolean default true,
  unique(habit_id, date)
);
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/habit-tracker.git

# Install dependencies
npm install

# Create .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

## Environment Variables

| Variable                 | Description                 |
| ------------------------ | --------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL   |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## RLS Policies

The app uses Row Level Security to ensure users can only access their own data. Example policy for `habit_logs`:

```sql
create policy "Users can view their own logs"
on habit_logs for select
using (auth.uid() = (select user_id from habits where id = habit_logs.habit_id));
```

## Deployment

The app is deployed on **Vercel** with automatic deployments from the main branch.

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Supabase Redirect URLs Configuration

After deployment, add your production URL to Supabase allowed redirects:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to Redirect URLs:
   - `https://your-vercel-app.vercel.app/**`
3. Keep `http://localhost:5173/**` for local development
