-- Drop existing views first to avoid dependency issues
drop view if exists "public"."project_analytics";
drop view if exists "public"."task_analytics";
drop view if exists "public"."revenue_analytics";

-- Create base tables if they don't exist
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
  "start_date" date default current_date not null,
  "due_date" date,
  "completion_percentage" integer default 0,
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

-- Enable RLS
alter table if exists "public"."projects" enable row level security;
alter table if exists "public"."tasks" enable row level security;
alter table if exists "public"."clients" enable row level security;
alter table if exists "public"."team_members" enable row level security;
alter table if exists "public"."invoices" enable row level security;

-- Create RLS policies
create policy "Enable all actions for users based on user_id" on "public"."clients"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for users based on user_id" on "public"."projects"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for users based on user_id" on "public"."tasks"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for users based on user_id" on "public"."team_members"
  for all using (auth.uid() = user_id);

create policy "Enable all actions for users based on user_id" on "public"."invoices"
  for all using (auth.uid() = user_id);

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

-- Create RLS policies for views
create policy "Enable read access for users based on user_id" on public.project_analytics
  for select using (auth.uid() = user_id);

create policy "Enable read access for users based on user_id" on public.task_analytics
  for select using (auth.uid() = user_id);

create policy "Enable read access for users based on user_id" on public.revenue_analytics
  for select using (auth.uid() = user_id);

-- Add indexes for better performance
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_clients_user_id on public.clients(user_id);
create index if not exists idx_team_members_user_id on public.team_members(user_id);
create index if not exists idx_invoices_user_id on public.invoices(user_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_tasks_completion on public.tasks(completed, due_date);
create index if not exists idx_invoices_status on public.invoices(status);
