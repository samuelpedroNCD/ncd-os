import React from 'react';
import { BarChart } from 'lucide-react';
import { Button } from '../ui/Button';

export function ProjectList({ projects, onViewAll }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-500';
      case 'On Hold':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <div className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{project.name}</p>
                <p className="text-sm text-muted-foreground">{project.client}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(project.status)}`}>
              {project.status}
            </span>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No recent projects</p>
        )}
      </div>
    </div>
  );
}
