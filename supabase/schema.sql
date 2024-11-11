-- Drop existing views first to avoid dependency issues
drop view if exists public.project_analytics;
drop view if exists public.task_analytics;
drop view if exists public.revenue_analytics;

-- Add completion_percentage and completion_date columns if they don't exist
do $$ 
begin
  -- Add completion_percentage to projects if it doesn't exist
  if not exists (select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'projects' 
    and column_name = 'completion_percentage') then
    
    alter table public.projects 
    add column completion_percentage integer default 0;
  end if;

  -- Add start_date to projects if it doesn't exist
  if not exists (select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'projects' 
    and column_name = 'start_date') then
    
    alter table public.projects 
    add column start_date date not null default current_date;
  end if;

  -- Add completion_date to tasks if it doesn't exist
  if not exists (select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'tasks' 
    and column_name = 'completion_date') then
    
    alter table public.tasks 
    add column completion_date timestamp with time zone;
  end if;
end $$;

-- Now create the views
create view public.project_analytics as
select
  user_id,
  count(*) as total_projects,
  count(*) filter (where status = 'In Progress') as active_projects,
  count(*) filter (where status = 'Completed') as completed_projects,
  avg(completion_percentage) as avg_completion,
  sum(budget) as total_budget
from public.projects
group by user_id;

create view public.task_analytics as
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

create view public.revenue_analytics as
select
  user_id,
  sum(amount) filter (where status = 'Paid') as total_revenue,
  sum(amount) filter (where status = 'Pending') as pending_revenue,
  sum(amount) filter (where status = 'Overdue') as overdue_revenue,
  count(*) filter (where status = 'Paid') as paid_invoices,
  count(*) filter (where status = 'Pending') as pending_invoices
from public.invoices
group by user_id;

-- Enable RLS
alter table if exists "public"."projects" enable row level security;
alter table if exists "public"."tasks" enable row level security;
alter table if exists "public"."clients" enable row level security;
alter table if exists "public"."team_members" enable row level security;
alter table if exists "public"."invoices" enable row level security;

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
