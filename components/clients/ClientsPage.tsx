
import React, { useState, useMemo } from 'react';
import { Plus, Search, Users, X, Phone, Mail, Edit3, Trash2, User, Building, DollarSign, Briefcase, MapPin, Calendar, CheckCircle, Hash } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import ClientCard from './ClientCard';
import AddClientModal from './AddClientModal';
import EmptyState from '../common/EmptyState';
import QuickActionButton from '../common/QuickActionButton';
import { Client } from '../../types';
import { useUI } from '../../contexts/UIContext';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';


// --- ClientDetailsModal Component Definition ---

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-4">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
);

const DetailItem = ({ label, value, icon }: { label: string, value: string | number | null, icon?: React.ReactNode }) => (
    <div>
      <label className="text-xs font-medium text-gray-500 flex items-center">
        {icon && React.cloneElement(icon as React.ReactElement, { className: "w-3.5 h-3.5 mr-1.5 text-gray-400" })}
        {label}
      </label>
      <p className="mt-1 text-sm text-gray-900 break-words">{value || 'N/A'}</p>
    </div>
);

const ClientDetailsModal = ({ client, onClose, onEdit, onDelete }: ClientDetailsModalProps) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in sm:items-center">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform animate-slide-up flex flex-col max-h-[90vh]">
        <header className="flex items-start justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {client.photo_url ? (
                        <img src={client.photo_url} alt={client.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{client.full_name}</h2>
                    <p className="text-sm text-gray-600">{client.designation || 'N/A'}</p>
                    <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        client.relationship_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {client.relationship_status}
                    </span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-600" />
            </button>
        </header>
        
        <div className="p-3 flex space-x-2 border-b">
            <button disabled={!client.phone} onClick={() => { if(client.phone) window.location.href = `tel:${client.phone}`}} className="flex-1 flex items-center justify-center py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold disabled:opacity-50">
                <Phone className="w-4 h-4 mr-2" /> Call
            </button>
            <button disabled={!client.email} onClick={() => { if(client.email) window.location.href = `mailto:${client.email}`}} className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50">
                <Mail className="w-4 h-4 mr-2" /> Email
            </button>
            <DropdownMenu trigger={<button className="p-2 rounded-lg border hover:bg-gray-100">...</button>} children={
              <>
                <DropdownMenuItem onClick={() => onEdit(client)} icon={<Edit3 className="w-4 h-4 mr-2" />} children="Edit" />
                <DropdownMenuItem onClick={() => onDelete(client.id)} icon={<Trash2 className="w-4 h-4 mr-2" />} className="text-red-600" children="Delete" />
              </>
            } />
        </div>

        <main className="p-4 overflow-y-auto space-y-4">
            {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
            <Section title="Personal Details" children={
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailItem label="Mobile Number" value={client.phone} icon={<Phone />} />
                <DetailItem label="Email Address" value={client.email} icon={<Mail />} />
                <DetailItem label="Date of Birth" value={client.dob ? new Date(client.dob).toLocaleDateString() : null} icon={<Calendar />} />
                <DetailItem label="Nationality" value={client.nationality} icon={<User />} />
              </div>
            } />
            {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
            <Section title="Identification & Residency" children={
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailItem label="Emirates ID" value={client.emirates_id} icon={<Hash />} />
                <DetailItem label="Passport" value={client.passport} icon={<Hash />} />
                <DetailItem label="Emirate" value={client.emirate} icon={<MapPin />} />
                <DetailItem label="Visa Status" value={client.visa_status} icon={<CheckCircle />} />
              </div>
            } />
            {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
            <Section title="Employment Details" children={
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailItem label="Company" value={client.company_name} icon={<Building />} />
                <DetailItem label="Designation" value={client.designation} icon={<Briefcase />} />
                <DetailItem label="Monthly Salary (AED)" value={client.monthly_salary?.toLocaleString() || null} icon={<DollarSign />} />
                <DetailItem label="Client Since" value={client.client_since ? new Date(client.client_since).toLocaleDateString() : null} icon={<Calendar />} />
              </div>
            } />
        </main>
      </div>
    </div>
  );
}

// --- End of ClientDetailsModal ---


export default function ClientsPage() {
  const { clients, isLoading, deleteClient } = useClients();
  const { showConfirmation, addNotification } = useUI();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleCloseModals = () => {
    setSelectedClient(null);
    setEditingClient(null);
    setIsAddingClient(false);
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };
  
  const handleEditClient = (client: Client) => {
    setSelectedClient(null);
    setEditingClient(client);
    setIsAddingClient(false);
  };

  const handleDeleteClient = (id: string) => {
    const clientToDelete = clients.find(c => c.id === id);
    if (!clientToDelete) return;

    showConfirmation(
      'Delete Client?',
      `Are you sure you want to permanently delete ${clientToDelete.full_name}? This action cannot be undone.`,
      () => {
        deleteClient(id, {
            onSuccess: () => {
              addNotification('Client Deleted', `${clientToDelete.full_name} has been removed.`);
              handleCloseModals();
            },
            onError: (e) => addNotification('Error', (e as Error).message),
        });
      }
    );
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
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <QuickActionButton
              onClick={() => setIsAddingClient(true)}
              icon={<Plus className="w-5 h-5 text-white" />}
              title="Add New Client"
              subtitle="Register a new client account"
              colorClass="bg-purple-500"
            />
        </div>

        <div className="space-y-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onClick={handleSelectClient}
              />
            ))
          ) : (
            <EmptyState
              icon={<Users className="w-12 h-12 text-gray-300" />}
              title="No Clients Found"
              message="Your client list is empty. Add a new client to get started."
            />
          )}
        </div>
      </div>
      
      {selectedClient && (
        <ClientDetailsModal 
          client={selectedClient}
          onClose={handleCloseModals}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}

      {(isAddingClient || editingClient) && (
        <AddClientModal 
          onClose={handleCloseModals} 
          initialData={editingClient} 
        />
      )}
    </div>
  );
}
