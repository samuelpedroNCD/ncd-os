import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Mail } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TeamMemberForm } from '../components/team/TeamMemberForm';
import { useTeamStore } from '../stores/teamStore';

export function Team() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { members, loading, error, fetchMembers, addMember, updateMember, deleteMember } = useTeamStore();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleCreateMember = async (data) => {
    const { error } = await addMember(data);
    if (!error) {
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateMember = async (data) => {
    const { error } = await updateMember(editingMember.id, data);
    if (!error) {
      setEditingMember(null);
    }
  };

  const handleDeleteMember = async (id) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      await deleteMember(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="pt-24 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="pt-24 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-destructive">Error: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Team</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">{member.name}</h2>
                  <p className="text-muted-foreground">{member.role}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </a>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingMember(member)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No team members yet. Add one to get started!
              </div>
            )}
          </div>

          <Modal
            title="Add Team Member"
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            trigger={null}
          >
            <TeamMemberForm onSubmit={handleCreateMember} />
          </Modal>

          <Modal
            title="Edit Team Member"
            open={!!editingMember}
            onOpenChange={() => setEditingMember(null)}
            trigger={null}
          >
            {editingMember && (
              <TeamMemberForm
                initialData={editingMember}
                onSubmit={handleUpdateMember}
              />
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}