import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTaskStore } from '../stores/taskStore';
import { useProjectStore } from '../stores/projectStore';

export function Tasks() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTaskStore();
  const projects = useProjectStore((state) => state.projects);

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const handleCreateTask = (data) => {
    addTask(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTask = (data) => {
    updateTask(editingTask.id, data);
    setEditingTask(null);
  };

  const handleDeleteTask = (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'Low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border backdrop-blur-xl ${
                  task.completed
                    ? 'bg-card/30 border-border'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskStatus(task.id)}
                      className="mt-1.5"
                    />
                    <div>
                      <h3 className={`font-medium ${
                        task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>{getProjectName(task.projectId)}</span>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTask(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No tasks yet. Create one to get started!
              </div>
            )}
          </div>

          <Modal
            title="Create Task"
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            trigger={null}
          >
            <TaskForm onSubmit={handleCreateTask} />
          </Modal>

          <Modal
            title="Edit Task"
            open={!!editingTask}
            onOpenChange={() => setEditingTask(null)}
            trigger={null}
          >
            {editingTask && (
              <TaskForm
                initialData={editingTask}
                onSubmit={handleUpdateTask}
              />
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}