import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ClientForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    company: initialData?.company || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    website: initialData?.website || '',
    industry: initialData?.industry || '',
    notes: initialData?.notes || '',
    tax_id: initialData?.tax_id || '',
    payment_terms: initialData?.payment_terms || '30',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Client Name *
          </label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter client name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email *
          </label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="client@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Company
          </label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Industry
          </label>
          <Input
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g., Technology, Healthcare"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Phone
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Website
          </label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Tax ID
          </label>
          <Input
            value={formData.tax_id}
            onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
            placeholder="Tax ID / VAT number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Payment Terms (days)
          </label>
          <Input
            type="number"
            min="0"
            value={formData.payment_terms}
            onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
            placeholder="30"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Address
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
          placeholder="Full address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
          placeholder="Additional notes about the client"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Client' : 'Create Client'}
      </Button>
    </form>
  );
}
