import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, FileText, Clock } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { StatCard } from '../components/dashboard/StatCard';
import { ProjectList } from '../components/dashboard/ProjectList';
import { TaskSummary } from '../components/dashboard/TaskSummary';
import { DeadlinesList } from '../components/dashboard/DeadlinesList';
import { RefreshButton } from '../components/dashboard/RefreshButton';
import { useProjectStore } from '../stores/projectStore';
import { useTaskStore } from '../stores/taskStore';
import { useClientStore } from '../stores/clientStore';
import { useInvoiceStore } from '../stores/invoiceStore';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('week'); // 'week' | 'month' | 'year'

  const projects = useProjectStore((state) => state.projects);
  const tasks = useTaskStore((state) => state.tasks);
  const clients = useClientStore((state) => state.clients);
  const invoices = useInvoiceStore((state) => state.invoices);

  // Calculate statistics
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  // Get filtered data
  const getFilteredData = () => {
    const now = new Date();
    const timeAgo = new Date();
    
    switch (timeRange) {
      case 'week':
        timeAgo.setDate(now.getDate() - 7);
        break;
      case 'month':
        timeAgo.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        timeAgo.setFullYear(now.getFullYear() - 1);
        break;
      default:
        timeAgo.setDate(now.getDate() - 7);
    }

    return {
      recentProjects: projects
        .filter(p => new Date(p.created_at) > timeAgo)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
      upcomingDeadlines: tasks
        .filter(task => !task.completed && new Date(task.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)
    };
  };

  const { recentProjects, upcomingDeadlines } = getFilteredData();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would fetch fresh data here
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="year">Last year</option>
              </select>
              <RefreshButton onClick={handleRefresh} loading={refreshing} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Projects"
              value={activeProjects}
              icon={Activity}
              color="primary"
            />
            <StatCard
              title="Total Clients"
              value={clients.length}
              icon={Users}
              color="blue-500"
            />
            <StatCard
              title="Pending Tasks"
              value={tasks.filter(t => !t.completed).length}
              icon={Clock}
              color="yellow-500"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              icon={FileText}
              color="green-500"
            />
          </div>

          {/* Task Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <ProjectList
                projects={recentProjects}
                onViewAll={() => navigate('/projects')}
              />
            </div>
            <TaskSummary tasks={tasks} />
          </div>

          {/* Upcoming Deadlines */}
          <DeadlinesList
            tasks={upcomingDeadlines}
            onViewAll={() => navigate('/tasks')}
          />
        </div>
      </main>
    </div>
  );
}
