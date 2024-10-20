import React, { useState } from 'react';

interface SampleCollectionAddressProps {
  onSave: (address: string) => void;
  onClose: () => void;
}

const SampleCollectionAddress: React.FC<SampleCollectionAddressProps> = ({ onSave, onClose }) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [selectedDefault, setSelectedDefault] = useState<number | null>(null);

  const handleAddNew = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress.trim()]);
      setNewAddress('');
    }
  };

  const handleEdit = (index: number, value: string) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = value;
    setAddresses(updatedAddresses);
  };

  const handleRemove = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    if (selectedDefault === index) {
      setSelectedDefault(null);
    } else if (selectedDefault !== null && index < selectedDefault) {
      setSelectedDefault(selectedDefault - 1);
    }
  };

  const handleDefaultChange = (index: number) => {
    setSelectedDefault(selectedDefault === index ? null : index);
  };

  const handleSave = () => {
    const defaultAddress = selectedDefault !== null ? addresses[selectedDefault] : addresses[0] || '';
    onSave(defaultAddress);
    onClose();
  };

  return (
    <div className="p-4 text-[#000000]">
      <h2 className="text-xl font-semibold mb-4">Add Collected at</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">By Default</span>
          <span className="font-semibold">Address</span>
          <span className="font-semibold">Action</span>
        </div>
        {addresses.map((address, index) => (
          <div key={index} className="flex items-center space-x-2">
            {address.trim() && (
              <input
                type="checkbox"
                checked={selectedDefault === index}
                onChange={() => handleDefaultChange(index)}
              />
            )}
            <input
              type="text"
              value={address}
              onChange={(e) => handleEdit(index, e.target.value)}
              className="flex-grow px-2 py-1 border rounded"
            />
            <button
              onClick={() => handleRemove(index)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Enter new address"
            className="flex-grow px-2 py-1 border rounded"
          />
          <button
            onClick={handleAddNew}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Add New
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Close
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SampleCollectionAddress;
