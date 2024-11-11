import React from 'react';

export function TaskSummary({ tasks }) {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return !task.completed && dueDate < new Date();
  }).length;

  const total = tasks.length;

  return (
    <div className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl">
      <h2 className="text-lg font-semibold text-foreground mb-4">Task Summary</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Completed</span>
            <span className="text-green-500">{completedTasks}</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-300" 
              style={{ width: `${total ? (completedTasks / total) * 100 : 0}%` }} 
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">In Progress</span>
            <span className="text-blue-500">{pendingTasks}</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300" 
              style={{ width: `${total ? (pendingTasks / total) * 100 : 0}%` }} 
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overdue</span>
            <span className="text-destructive">{overdueTasks}</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div 
              className="h-full bg-destructive rounded-full transition-all duration-300" 
              style={{ width: `${total ? (overdueTasks / total) * 100 : 0}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
