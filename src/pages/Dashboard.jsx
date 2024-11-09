import { TopNav } from '../components/TopNav';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Active Projects</h2>
              <p className="text-3xl font-bold text-blue-500">12</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Pending Tasks</h2>
              <p className="text-3xl font-bold text-purple-500">34</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Total Revenue</h2>
              <p className="text-3xl font-bold text-green-500">$52,400</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}