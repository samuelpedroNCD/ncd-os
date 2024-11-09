import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function TeamMemberForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    email: initialData?.email || '',
    skills: initialData?.skills || '',
    avatar: initialData?.avatar || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">
          Name
        </label>
        <Input
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">
          Role
        </label>
        <Input
          required
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">
          Email
        </label>
        <Input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">
          Skills (comma-separated)
        </label>
        <Input
          required
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="React, Node.js, TypeScript"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">
          Avatar URL
        </label>
        <Input
          type="url"
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Team Member' : 'Add Team Member'}
      </Button>
    </form>
  );
}