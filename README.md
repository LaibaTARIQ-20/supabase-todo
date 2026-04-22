# Supabase Todo App

A full-stack Todo application built with **Next.js 16** (App Router) and **Supabase** (PostgreSQL + Auth).

## Features

- **Authentication**: Secure sign up and sign in using Supabase Auth.
- **Dedicated Auth Routes**: Separate pages for `/login` and `/register`.
- **Protected Routes**: Automatically redirects unauthenticated users away from the `/todos` page.
- **CRUD Operations**: Users can add, view, complete, and delete their own tasks.
- **Row Level Security (RLS)**: Data is protected at the database level so users can only access their own todos.
- **Realtime Updates**: The UI responds immediately to state changes.
- **Modern UI**: Styled beautifully with Tailwind CSS.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js installed on your machine
- A Supabase account and project

### Database Setup

Run the following SQL in your Supabase SQL Editor to set up the `todos` table and Row Level Security policies:

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own todos
CREATE POLICY "Users see own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can insert their own todos
CREATE POLICY "Users insert own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can update their own todos
CREATE POLICY "Users update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: users can delete their own todos
CREATE POLICY "Users delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);
```

### Installation

1. Clone this repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `app/page.tsx`: The root page which automatically handles routing depending on auth state.
- `app/login/page.tsx`: The sign in route.
- `app/register/page.tsx`: The sign up route.
- `app/todos/page.tsx`: The protected main dashboard for managing tasks.
- `components/AuthForm.tsx`: Reusable authentication form component.
- `components/TodoList.tsx`: Handles fetching, displaying, and mutating the user's tasks.
- `lib/supabase.ts`: The initialized Supabase client and TypeScript definitions.
