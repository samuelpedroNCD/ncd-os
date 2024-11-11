-- Drop existing policies first
drop policy if exists "Enable all actions for authenticated users only" on "public"."clients";
drop policy if exists "Enable all actions for authenticated users only" on "public"."projects";
drop policy if exists "Enable all actions for authenticated users only" on "public"."tasks";
drop policy if exists "Enable all actions for authenticated users only" on "public"."team_members";
drop policy if exists "Enable all actions for authenticated users only" on "public"."invoices";
drop policy if exists "Enable all actions for invoice items" on "public"."invoice_items";
drop policy if exists "Enable read access for authenticated users" on "public"."project_analytics";
drop policy if exists "Enable read access for authenticated users" on "public"."task_analytics";
drop policy if exists "Enable read access for authenticated users" on "public"."revenue_analytics";

-- Enable RLS
alter table if exists "public"."projects" enable row level security;
alter table if exists "public"."tasks" enable row level security;
alter table if exists "public"."clients" enable row level security;
alter table if exists "public"."team_members" enable row level security;
alter table if exists "public"."invoices" enable row level security;
alter table if exists "public"."invoice_items" enable row level security;

-- Create or update tables
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
  "start_date" date not null default current_date,
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
  "completion_date" timestamp with time zone,
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

-- Add analytics views for dashboard
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

-- Add function to calculate project health
create or replace function public.calculate_project_health(
  completion_percentage int,
  due_date date,
  start_date date
) returns text as $$
declare
  time_progress float;
  expected_completion float;
begin
  -- Calculate time progress as percentage
  time_progress := case
    when due_date = start_date then 100
    else extract(epoch from (current_date - start_date)) / 
         extract(epoch from (due_date - start_date)) * 100
  end;

  -- Expected completion based on time progress
  expected_completion := time_progress;

  -- Return health status
  return case
    when completion_percentage >= 100 then 'Completed'
    when completion_percentage >= expected_completion - 10 then 'On Track'
    when completion_percentage >= expected_completion - 20 then 'At Risk'
    else 'Behind Schedule'
  end;
end;
$$ language plpgsql;

-- Add function to get dashboard summary
create or replace function public.get_dashboard_summary(p_user_id uuid)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'projects', (
      select json_build_object(
        'total', count(*),
        'active', count(*) filter (where status = 'In Progress'),
        'completed', count(*) filter (where status = 'Completed'),
        'health', json_build_object(
          'on_track', count(*) filter (where calculate_project_health(completion_percentage, due_date, start_date) = 'On Track'),
          'at_risk', count(*) filter (where calculate_project_health(completion_percentage, due_date, start_date) = 'At Risk'),
          'behind', count(*) filter (where calculate_project_health(completion_percentage, due_date, start_date) = 'Behind Schedule')
        )
      ) from public.projects where user_id = p_user_id
    ),
    'tasks', (
      select json_build_object(
        'total', count(*),
        'completed', count(*) filter (where completed = true),
        'overdue', count(*) filter (where completed = false and due_date < current_date),
        'due_this_week', count(*) filter (where completed = false and due_date between current_date and current_date + interval '7 days')
      ) from public.tasks where user_id = p_user_id
    ),
    'revenue', (
      select json_build_object(
        'total_paid', sum(amount) filter (where status = 'Paid'),
        'pending', sum(amount) filter (where status = 'Pending'),
        'overdue', sum(amount) filter (where status = 'Overdue')
      ) from public.invoices where user_id = p_user_id
    )
  ) into result;
  
  return result;
end;
$$ language plpgsql security definer;

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

-- Add RLS policies for analytics views
create policy "Enable read access for authenticated users" on public.project_analytics
  for select using (auth.uid() = user_id);

create policy "Enable read access for authenticated users" on public.task_analytics
  for select using (auth.uid() = user_id);

create policy "Enable read access for authenticated users" on public.revenue_analytics
  for select using (auth.uid() = user_id);

-- Add indexes for analytics performance
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_tasks_completion on public.tasks(completed, due_date);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_projects_dates on public.projects(start_date, due_date);
