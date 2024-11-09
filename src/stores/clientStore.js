import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useClientStore = create(
  persist(
    (set) => ({
      clients: [],
      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, { ...client, id: Date.now().toString() }],
        })),
      updateClient: (id, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updatedClient } : client
          ),
        })),
      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        })),
    }),
    {
      name: 'client-storage',
    }
  )
);