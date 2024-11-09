-- Enable RLS
alter table if exists "public"."projects" enable row level security;
alter table if exists "public"."tasks" enable row level security;
alter table if exists "public"."clients" enable row level security;
alter table if exists "public"."team_members" enable row level security;
alter table if exists "public"."invoices" enable row level security;

-- Create tables
create table if not exists "public"."clients" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "name" text not null,
  "email" text not null,
  "company" text,
  "phone" text,
  "address" text,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."projects" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "name" text not null,
  "client_id" uuid references public.clients not null,
  "budget" numeric(10,2),
  "status" text not null,
  "due_date" date,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."tasks" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "title" text not null,
  "description" text,
  "project_id" uuid references public.projects not null,
  "due_date" date,
  "priority" text not null,
  "completed" boolean default false,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."team_members" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "name" text not null,
  "email" text not null,
  "role" text not null,
  "skills" text[],
  "avatar" text,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."invoices" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "number" text not null,
  "client_id" uuid references public.clients not null,
  "amount" numeric(10,2) not null,
  "status" text not null,
  "due_date" date not null,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."invoice_items" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "invoice_id" uuid references public.invoices not null,
  "description" text not null,
  "amount" numeric(10,2) not null
);

-- Create RLS policies
create policy "Enable all actions for authenticated users only" on "public"."clients"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for authenticated users only" on "public"."projects"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for authenticated users only" on "public"."tasks"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for authenticated users only" on "public"."team_members"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for authenticated users only" on "public"."invoices"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for invoice items" on "public"."invoice_items"
  for all using (
    exists (
      select 1 from public.invoices
      where id = invoice_id and user_id = auth.uid()
    )
  );