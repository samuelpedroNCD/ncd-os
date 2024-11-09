import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProjectForm } from '../components/projects/ProjectForm';
import { useProjectStore } from '../stores/projectStore';

export function Projects() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();

  const handleCreateProject = (data) => {
    addProject(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProject = (data) => {
    updateProject(editingProject.id, data);
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          <div className="mt-6 grid gap-6">
            {projects.map((project) => (
              <div key={project.id} className="p-6 rounded-lg bg-card border border-border backdrop-blur-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  <span>Budget: ${parseInt(project.budget).toLocaleString()}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {project.status}
                  </span>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No projects yet. Create one to get started!
              </div>
            )}
          </div>

          <Modal
            title="Create Project"
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            trigger={null}
          >
            <ProjectForm onSubmit={handleCreateProject} />
          </Modal>

          <Modal
            title="Edit Project"
            open={!!editingProject}
            onOpenChange={() => setEditingProject(null)}
            trigger={null}
          >
            {editingProject && (
              <ProjectForm
                initialData={editingProject}
                onSubmit={handleUpdateProject}
              />
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}