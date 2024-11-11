import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function TeamMemberForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    department: initialData?.department || '',
    skills: initialData?.skills ? initialData.skills.join(', ') : '',
    avatar: initialData?.avatar || '',
    github: initialData?.github || '',
    linkedin: initialData?.linkedin || '',
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
    hourly_rate: initialData?.hourly_rate || '',
    bio: initialData?.bio || '',
    status: initialData?.status || 'Active',
    availability: initialData?.availability || 'Full-time'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up the data before submission
    const cleanedData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      // Only include non-empty values
      ...(formData.phone?.trim() ? { phone: formData.phone.trim() } : {}),
      ...(formData.github?.trim() ? { github: formData.github.trim() } : {}),
      ...(formData.linkedin?.trim() ? { linkedin: formData.linkedin.trim() } : {}),
      ...(formData.avatar?.trim() ? { avatar: formData.avatar.trim() } : {}),
      ...(formData.bio?.trim() ? { bio: formData.bio.trim() } : {}),
      ...(formData.department?.trim() ? { department: formData.department.trim() } : {}),
      // Handle start_date - if empty string or invalid, set to null
      start_date: formData.start_date ? formData.start_date : null
    };

    onSubmit(cleanedData);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      start_date: value || null
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Full Name *
          </label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
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
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Role *
          </label>
          <Input
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Senior Developer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Department
          </label>
          <Input
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Engineering"
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
            Start Date
          </label>
          <Input
            type="date"
            value={formData.start_date || ''}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Availability
          </label>
          <select
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Skills (comma-separated) *
        </label>
        <Input
          required
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="React, Node.js, TypeScript"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Hourly Rate ($)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.hourly_rate}
            onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Avatar URL
          </label>
          <Input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            GitHub Profile
          </label>
          <Input
            type="url"
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            placeholder="https://github.com/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            LinkedIn Profile
          </label>
          <Input
            type="url"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
          placeholder="Brief description about the team member..."
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Team Member' : 'Add Team Member'}
      </Button>
    </form>
  );
}
