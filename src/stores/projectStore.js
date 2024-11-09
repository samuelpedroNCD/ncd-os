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
      set({ projects: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createProject: async (project) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        projects: [data, ...state.projects],
        loading: false
      }));
      return { data, error: null };
    } catch (error) {
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
        projects: state.projects.map(p => p.id === id ? data : p),
        loading: false
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
        projects: state.projects.filter(p => p.id !== id),
        loading: false
      }));
      return { error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { error };
    }
  }
}));