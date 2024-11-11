import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export function DeadlinesList({ tasks, onViewAll }) {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-green-500/10 text-green-500';
    }
  };

  return (
    <div className="rounded-lg bg-card border border-border backdrop-blur-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h2>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                new Date(task.dueDate) < new Date()
                  ? 'bg-destructive/10'
                  : 'bg-yellow-500/10'
              }`}>
                {new Date(task.dueDate) < new Date() ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityStyle(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No upcoming deadlines</p>
        )}
      </div>
    </div>
  );
}
