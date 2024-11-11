import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addProject: async (project) => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...project,
          user_id: user.id,
          completion_percentage: 0,
          status: project.status || 'In Progress'
        }])
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        projects: [data, ...state.projects],
        loading: false,
        error: null
      }));
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding project:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  updateProject: async (id, updates) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        projects: state.projects.map(project => 
          project.id === id ? data : project
        ),
        loading: false,
        error: null
      }));
      
      return { data, error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  deleteProject: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        projects: state.projects.filter(project => project.id !== id),
        loading: false,
        error: null
      }));
      
      return { error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { error };
    }
  }
}));
