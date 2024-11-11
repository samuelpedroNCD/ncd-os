import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useClientStore } from '../../stores/clientStore';

export function ProjectForm({ onSubmit, initialData }) {
  const { clients, fetchClients } = useClientStore();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    client_id: initialData?.client_id || '',
    budget: initialData?.budget || '',
    due_date: initialData?.due_date || '',
    status: initialData?.status || 'In Progress',
    completion_percentage: initialData?.completion_percentage || 0
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

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
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Client
        </label>
        <select
          required
          value={formData.client_id}
          onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} {client.company ? `(${client.company})` : ''}
            </option>
          ))}
        </select>
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
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
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
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Completion Percentage
        </label>
        <Input
          type="number"
          min="0"
          max="100"
          value={formData.completion_percentage}
          onChange={(e) => setFormData({ ...formData, completion_percentage: parseInt(e.target.value) || 0 })}
        />
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  );
}
