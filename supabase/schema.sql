-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create polls table
create table if not exists public.polls (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  created_by uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  allow_multiple boolean default false,
  require_login boolean default true,
  expires_at timestamp with time zone,
  is_active boolean default true
);

-- Create poll_options table
create table if not exists public.poll_options (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  text text not null,
  votes integer default 0
);

-- Ensure votes column exists (in case table already existed without it)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'poll_options' and column_name = 'votes') then
    alter table public.poll_options add column votes integer default 0;
  end if;
end $$;

-- Create votes table (to track who voted)
create table if not exists public.votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  option_id uuid references public.poll_options(id) on delete cascade not null,
  user_id uuid references auth.users(id), -- Can be null for anonymous votes if we allow them later
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(poll_id, user_id) -- Prevent multiple votes per user per poll (unless we change logic)
);

-- Enable RLS
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes enable row level security;

-- Policies for polls
create policy "Polls are viewable by everyone" 
  on public.polls for select 
  using (true);

create policy "Users can create polls" 
  on public.polls for insert 
  with check (auth.uid() = created_by);

create policy "Users can update their own polls" 
  on public.polls for update 
  using (auth.uid() = created_by);

create policy "Users can delete their own polls" 
  on public.polls for delete 
  using (auth.uid() = created_by);

-- Policies for poll_options
create policy "Options are viewable by everyone" 
  on public.poll_options for select 
  using (true);

create policy "Users can create options for their polls" 
  on public.poll_options for insert 
  with check (
    exists (
      select 1 from public.polls 
      where id = poll_id and created_by = auth.uid()
    )
  );

-- Policies for votes
create policy "Votes are viewable by everyone" 
  on public.votes for select 
  using (true);

create policy "Authenticated users can vote" 
  on public.votes for insert 
  with check (auth.uid() = user_id);
