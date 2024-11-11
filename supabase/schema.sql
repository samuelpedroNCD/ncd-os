-- First, drop existing tables if they exist
drop table if exists "public"."invoice_items" cascade;
drop table if exists "public"."invoices" cascade;
drop table if exists "public"."tasks" cascade;
drop table if exists "public"."projects" cascade;
drop table if exists "public"."clients" cascade;
drop table if exists "public"."team_members" cascade;

-- Create tables
create table if not exists "public"."clients" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "name" text not null,
  "email" text not null,
  "company" text,
  "phone" text,
  "address" text,
  "website" text,
  "industry" text,
  "notes" text,
  "tax_id" text,
  "payment_terms" integer default 30,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."projects" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "name" text not null,
  "description" text,
  "client_id" uuid references public.clients,
  "budget" numeric(10,2),
  "status" text not null,
  "completion_percentage" integer default 0,
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
  "completion_date" timestamp with time zone,
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

-- Enable RLS
alter table if exists "public"."projects" enable row level security;
alter table if exists "public"."tasks" enable row level security;
alter table if exists "public"."clients" enable row level security;
alter table if exists "public"."team_members" enable row level security;
alter table if exists "public"."invoices" enable row level security;
alter table if exists "public"."invoice_items" enable row level security;

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

-- Create analytics views
create or replace view public.project_analytics as
select
  user_id,
  count(*) as total_projects,
  count(*) filter (where status = 'In Progress') as active_projects,
  count(*) filter (where status = 'Completed') as completed_projects,
  avg(completion_percentage) as avg_completion,
  sum(budget) as total_budget
from public.projects
group by user_id;

create or replace view public.task_analytics as
select
  user_id,
  count(*) as total_tasks,
  count(*) filter (where completed = true) as completed_tasks,
  count(*) filter (where completed = false and due_date < current_date) as overdue_tasks,
  avg(case when completed = true and completion_date is not null
      then extract(epoch from (completion_date - created_at))/86400.0
      else null end) as avg_completion_days
from public.tasks
group by user_id;

create or replace view public.revenue_analytics as
select
  user_id,
  sum(amount) filter (where status = 'Paid') as total_revenue,
  sum(amount) filter (where status = 'Pending') as pending_revenue,
  sum(amount) filter (where status = 'Overdue') as overdue_revenue,
  count(*) filter (where status = 'Paid') as paid_invoices,
  count(*) filter (where status = 'Pending') as pending_invoices
from public.invoices
group by user_id;
