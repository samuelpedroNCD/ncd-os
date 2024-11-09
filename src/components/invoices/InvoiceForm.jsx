import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useClientStore } from '../../stores/clientStore';

export function InvoiceForm({ onSubmit, initialData }) {
  const clients = useClientStore((state) => state.clients);
  const [formData, setFormData] = useState({
    clientId: initialData?.clientId || '',
    amount: initialData?.amount || '',
    dueDate: initialData?.dueDate || '',
    status: initialData?.status || 'Pending',
    items: initialData?.items || [{ description: '', amount: '' }],
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', amount: '' }],
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = formData.items.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    onSubmit({ ...formData, amount: totalAmount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">
          Client
        </label>
        <select
          required
          value={formData.clientId}
          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.company}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">
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
        <label className="block text-sm font-medium text-zinc-200 mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-zinc-200">
            Items
          </label>
          <Button type="button" variant="ghost" onClick={addItem}>
            Add Item
          </Button>
        </div>
        {formData.items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-1">
              <Input
                required
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
              />
            </div>
            <div className="w-32">
              <Input
                required
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => updateItem(index, 'amount', e.target.value)}
              />
            </div>
            {formData.items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
              >
                ×
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Invoice' : 'Create Invoice'}
      </Button>
    </form>
  );
}