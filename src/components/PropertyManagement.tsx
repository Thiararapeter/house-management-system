import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit, Trash } from 'lucide-react';

interface Property {
  id: number;
  name: string;
  address: string;
  owner: string;
  caretaker: string;
}

const PropertyManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const queryClient = useQueryClient();

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => axios.get('/api/properties').then((res) => res.data),
  });

  const addPropertyMutation = useMutation({
    mutationFn: (newProperty: Omit<Property, 'id'>) =>
      axios.post('/api/properties', newProperty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsModalOpen(false);
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: (updatedProperty: Property) =>
      axios.put(`/api/properties/${updatedProperty.id}`, updatedProperty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsModalOpen(false);
      setEditingProperty(null);
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const propertyData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      owner: formData.get('owner') as string,
      caretaker: formData.get('caretaker') as string,
    };

    if (editingProperty) {
      updatePropertyMutation.mutate({ ...propertyData, id: editingProperty.id });
    } else {
      addPropertyMutation.mutate(propertyData);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Property Management</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="inline-block mr-2" />
        Add Property
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Owner</th>
            <th className="py-2 px-4 border-b">Caretaker</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(properties) && properties.map((property) => (
            <tr key={property.id}>
              <td className="py-2 px-4 border-b">{property.name}</td>
              <td className="py-2 px-4 border-b">{property.address}</td>
              <td className="py-2 px-4 border-b">{property.owner}</td>
              <td className="py-2 px-4 border-b">{property.caretaker}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => {
                    setEditingProperty(property);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit className="inline-block" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deletePropertyMutation.mutate(property.id)}
                >
                  <Trash className="inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Property Name"
                defaultValue={editingProperty?.name}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                defaultValue={editingProperty?.address}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="owner"
                placeholder="Owner"
                defaultValue={editingProperty?.owner}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="caretaker"
                placeholder="Caretaker"
                defaultValue={editingProperty?.caretaker}
                className="mb-4 w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProperty(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editingProperty ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;