import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useTeamStore = create((set, get) => ({
  members: [],
  loading: false,
  error: null,

  fetchMembers: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ members: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addMember: async (member) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          ...member,
          user_id: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        members: [data, ...state.members],
        loading: false
      }));
      return { data, error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  updateMember: async (id, updates) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        members: state.members.map(m => m.id === id ? data : m),
        loading: false
      }));
      return { data, error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  deleteMember: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        members: state.members.filter(m => m.id !== id),
        loading: false
      }));
      return { error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { error };
    }
  }
}));