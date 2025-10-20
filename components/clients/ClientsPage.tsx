import React, { useState, useMemo } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import ClientCard from './ClientCard';
import AddClientModal from './AddClientModal';
import EmptyState from '../common/EmptyState';
import { Client } from '../../types';

export default function ClientsPage() {
  const { clients, isLoading } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingClient(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative pb-20">
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg">Clients</h3>
                    <p className="text-sm text-gray-500">{clients.length} total clients</p>
                </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
        </div>

        <div className="space-y-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onEdit={handleEdit}
              />
            ))
          ) : (
            <EmptyState
              icon={<Users className="w-12 h-12 text-gray-300" />}
              title="No Clients Found"
              message="Try adjusting your search, or add your first client."
            />
          )}
        </div>
      </div>
      
      <button
        onClick={() => { setEditingClient(null); setShowAddModal(true); }}
        className="fixed bottom-20 right-5 z-30 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-90"
        aria-label="Add new client"
      >
        <Plus className="w-7 h-7" />
      </button>

      {(showAddModal || editingClient) && <AddClientModal onClose={handleCloseModal} initialData={editingClient} />}
    </div>
  );
}