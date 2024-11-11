import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ClientForm } from '../components/clients/ClientForm';
import { useClientStore } from '../stores/clientStore';
import { useProjectStore } from '../stores/projectStore';

export function Clients() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const { clients, loading, error, fetchClients, addClient, updateClient, deleteClient } = useClientStore();
  const projects = useProjectStore((state) => state.projects);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const getClientProjects = (clientId) => {
    return projects.filter((project) => project.clientId === clientId);
  };

  const handleCreateClient = async (data) => {
    const { error } = await addClient(data);
    if (!error) {
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateClient = async (data) => {
    const { error } = await updateClient(editingClient.id, data);
    if (!error) {
      setEditingClient(null);
    }
  };

  const handleDeleteClient = async (id) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await deleteClient(id);
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
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {clients.map((client) => {
              const clientProjects = getClientProjects(client.id);
              return (
                <div
                  key={client.id}
                  className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-foreground flex items-center gap-2">
                        {client.name}
                        {client.company && (
                          <span className="text-sm text-muted-foreground">
                            @ {client.company}
                          </span>
                        )}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {client.phone}
                          </p>
                        )}
                        {client.company && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {client.company}
                          </p>
                        )}
                      </div>
                      {client.address && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {client.address}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingClient(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Active Projects: </span>
                      <span className="font-medium text-foreground">{clientProjects.length}</span>
                    </div>
                    {clientProjects.length > 0 && (
                      <div className="flex -space-x-2">
                        {clientProjects.slice(0, 3).map((project) => (
                          <div
                            key={project.id}
                            className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                            title={project.name}
                          >
                            {project.name.charAt(0)}
                          </div>
                        ))}
                        {clientProjects.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                            +{clientProjects.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {clients.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No clients yet. Create one to get started!
              </div>
            )}
          </div>

          <Modal
            title="Create Client"
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            trigger={null}
          >
            <ClientForm onSubmit={handleCreateClient} />
          </Modal>

          <Modal
            title="Edit Client"
            open={!!editingClient}
            onOpenChange={() => setEditingClient(null)}
            trigger={null}
          >
            {editingClient && (
              <ClientForm
                initialData={editingClient}
                onSubmit={handleUpdateClient}
              />
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}
