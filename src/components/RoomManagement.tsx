import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit, Trash, User } from 'lucide-react';

interface Room {
  id: number;
  number: string;
  type: string;
  status: 'vacant' | 'occupied';
  tenant: string;
  property: string;
}

const RoomManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const queryClient = useQueryClient();

  const { data: rooms, isLoading, error } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => axios.get('/api/rooms').then((res) => res.data),
  });

  const addRoomMutation = useMutation({
    mutationFn: (newRoom: Omit<Room, 'id'>) =>
      axios.post('/api/rooms', newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsModalOpen(false);
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: (updatedRoom: Room) =>
      axios.put(`/api/rooms/${updatedRoom.id}`, updatedRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsModalOpen(false);
      setEditingRoom(null);
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/rooms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomData = {
      number: formData.get('number') as string,
      type: formData.get('type') as string,
      status: formData.get('status') as 'vacant' | 'occupied',
      tenant: formData.get('tenant') as string,
      property: formData.get('property') as string,
    };

    if (editingRoom) {
      updateRoomMutation.mutate({ ...roomData, id: editingRoom.id });
    } else {
      addRoomMutation.mutate(roomData);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Room Management</h1>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="inline-block mr-2" />
        Add Room
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Room Number</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Tenant</th>
            <th className="py-2 px-4 border-b">Property</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms?.map((room) => (
            <tr key={room.id}>
              <td className="py-2 px-4 border-b">{room.number}</td>
              <td className="py-2 px-4 border-b">{room.type}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded ${room.status === 'vacant' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {room.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">{room.tenant || 'N/A'}</td>
              <td className="py-2 px-4 border-b">{room.property}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => {
                    setEditingRoom(room);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit className="inline-block" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteRoomMutation.mutate(room.id)}
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
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="number"
                placeholder="Room Number"
                defaultValue={editingRoom?.number}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="type"
                placeholder="Room Type"
                defaultValue={editingRoom?.type}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <select
                name="status"
                defaultValue={editingRoom?.status}
                className="mb-2 w-full p-2 border rounded"
                required
              >
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
              </select>
              <input
                type="text"
                name="tenant"
                placeholder="Tenant Name"
                defaultValue={editingRoom?.tenant}
                className="mb-2 w-full p-2 border rounded"
              />
              <input
                type="text"
                name="property"
                placeholder="Property"
                defaultValue={editingRoom?.property}
                className="mb-4 w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingRoom(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editingRoom ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;