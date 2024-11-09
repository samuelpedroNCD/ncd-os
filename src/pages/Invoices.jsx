import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useClientStore } from '../stores/clientStore';

export function Invoices() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoiceStore();
  const clients = useClientStore((state) => state.clients);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name}${client.company ? ` - ${client.company}` : ''}` : 'Unknown Client';
  };

  const handleCreateInvoice = (data) => {
    addInvoice(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateInvoice = (data) => {
    updateInvoice(editingInvoice.id, data);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = (id) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/10 text-green-500';
      case 'Overdue':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-yellow-500/10 text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>

          <div className="mt-6">
            <div className="rounded-lg bg-card border border-border backdrop-blur-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          {invoice.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          {getClientName(invoice.clientId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingInvoice(invoice)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {invoices.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No invoices yet. Create one to get started!
                </div>
              )}
            </div>
          </div>

          <Modal
            title="Create Invoice"
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            trigger={null}
          >
            <InvoiceForm onSubmit={handleCreateInvoice} />
          </Modal>

          <Modal
            title="Edit Invoice"
            open={!!editingInvoice}
            onOpenChange={() => setEditingInvoice(null)}
            trigger={null}
          >
            {editingInvoice && (
              <InvoiceForm
                initialData={editingInvoice}
                onSubmit={handleUpdateInvoice}
              />
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}