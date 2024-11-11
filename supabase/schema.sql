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
  "description" text,
  "client_id" uuid references public.clients not null,
  "budget" numeric(10,2),
  "status" text not null,
  "start_date" date,
  "due_date" date,
  "completion_percentage" integer default 0,
  "priority" text,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."tasks" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "title" text not null,
  "description" text,
  "project_id" uuid references public.projects not null,
  "assignee_id" uuid references public.team_members,
  "due_date" date,
  "priority" text not null,
  "status" text not null default 'To Do',
  "completed" boolean default false,
  "completion_date" timestamp with time zone,
  "estimated_hours" numeric(5,2),
  "actual_hours" numeric(5,2),
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
  "hourly_rate" numeric(10,2),
  "availability_status" text default 'Available',
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."invoices" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "number" text not null,
  "client_id" uuid references public.clients not null,
  "project_id" uuid references public.projects,
  "amount" numeric(10,2) not null,
  "tax_rate" numeric(5,2) default 0,
  "status" text not null,
  "issue_date" date not null default current_date,
  "due_date" date not null,
  "paid_date" timestamp with time zone,
  "notes" text,
  "user_id" uuid references auth.users not null
);

create table if not exists "public"."invoice_items" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "invoice_id" uuid references public.invoices not null,
  "description" text not null,
  "quantity" numeric(10,2) default 1,
  "unit_price" numeric(10,2) not null,
  "amount" numeric(10,2) not null
);

-- Add activity logging table
create table if not exists "public"."activity_logs" (
  "id" uuid default gen_random_uuid() primary key,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "user_id" uuid references auth.users not null,
  "entity_type" text not null, -- 'project', 'task', 'invoice', etc.
  "entity_id" uuid not null,
  "action" text not null, -- 'created', 'updated', 'deleted', etc.
  "details" jsonb
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

create policy "Enable all actions for activity logs" on "public"."activity_logs"
  for all using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_assignee_id on public.tasks(assignee_id);
create index if not exists idx_invoices_client_id on public.invoices(client_id);
create index if not exists idx_invoices_project_id on public.invoices(project_id);
create index if not exists idx_activity_logs_entity on public.activity_logs(entity_type, entity_id);

-- Add functions for activity logging
create or replace function public.log_activity()
returns trigger as $$
begin
  insert into public.activity_logs (
    user_id,
    entity_type,
    entity_id,
    action,
    details
  ) values (
    auth.uid(),
    TG_ARGV[0],
    NEW.id,
    TG_OP,
    case
      when TG_OP = 'DELETE' then row_to_json(OLD)
      else row_to_json(NEW)
    end
  );
  return NEW;
end;
$$ language plpgsql security definer;

-- Add triggers for activity logging
create trigger projects_activity_log
  after insert or update or delete on public.projects
  for each row execute function public.log_activity('project');

create trigger tasks_activity_log
  after insert or update or delete on public.tasks
  for each row execute function public.log_activity('task');

create trigger invoices_activity_log
  after insert or update or delete on public.invoices
  for each row execute function public.log_activity('invoice');
