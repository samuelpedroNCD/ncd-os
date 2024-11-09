import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInvoiceStore = create(
  persist(
    (set) => ({
      invoices: [],
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, { 
            ...invoice, 
            id: Date.now().toString(),
            number: `INV-${String(state.invoices.length + 1).padStart(4, '0')}`,
            createdAt: new Date().toISOString(),
          }],
        })),
      updateInvoice: (id, updatedInvoice) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
          ),
        })),
      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        })),
    }),
    {
      name: 'invoice-storage',
    }
  )
);