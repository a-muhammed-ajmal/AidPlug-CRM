
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import ClientCard from './ClientCard';

export default function ClientsPage() {
  const { clients, isLoading } = useClients();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
          <p className="text-gray-600 text-sm mt-1">{clients.length} total clients</p>
        </div>
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No clients found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
