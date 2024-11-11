import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useClientStore = create((set, get) => ({
  clients: [],
  loading: false,
  error: null,

  // Fetch all clients
  fetchClients: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ clients: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add a new client
  addClient: async (client) => {
    set({ loading: true });
    try {
      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: user.user.id }])
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        clients: [data, ...state.clients],
        loading: false,
        error: null
      }));
      
      return { data, error: null };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Update an existing client
  updateClient: async (id, updates) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        clients: state.clients.map(client => 
          client.id === id ? data : client
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

  // Delete a client
  deleteClient: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        clients: state.clients.filter(client => client.id !== id),
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
