import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ProjectForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    client: initialData?.client || '',
    budget: initialData?.budget || '',
    dueDate: initialData?.dueDate || '',
    status: initialData?.status || 'In Progress',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Project Name
        </label>
        <Input
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Client
        </label>
        <Input
          required
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Budget
        </label>
        <Input
          type="number"
          required
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Due Date
        </label>
        <Input
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option>In Progress</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  );
}