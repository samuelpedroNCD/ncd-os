import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      
      initialize: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          set({ user, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user, error: null });
          return { data, error: null };
        } catch (error) {
          set({ error: error.message });
          return { data: null, error };
        }
      },

      signup: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user, error: null });
          return { data, error: null };
        } catch (error) {
          set({ error: error.message });
          return { data: null, error };
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, error: null });
        } catch (error) {
          set({ error: error.message });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);