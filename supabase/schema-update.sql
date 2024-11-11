-- Add new columns to clients table without dropping existing data
alter table if exists "public"."clients"
  add column if not exists "website" text,
  add column if not exists "industry" text,
  add column if not exists "notes" text,
  add column if not exists "tax_id" text,
  add column if not exists "payment_terms" integer default 30;

-- Add new columns to projects table
alter table if exists "public"."projects"
  add column if not exists "description" text,
  add column if not exists "completion_percentage" integer default 0;

-- Add completion_date to tasks table
alter table if exists "public"."tasks"
  add column if not exists "completion_date" timestamp with time zone;

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
