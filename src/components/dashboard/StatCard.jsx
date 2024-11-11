import React from 'react';

export function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-full bg-${color}/10 flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
      </div>
    </div>
  );
}
