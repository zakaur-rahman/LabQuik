import React, { useState } from 'react';

interface AddOrganizationProps {
  onSave: (organizationData: any) => void;
  onClose: () => void;
}

const AddOrganization: React.FC<AddOrganizationProps> = ({ onSave, onClose }) => {
  const [referralType, setReferralType] = useState<'Doctor' | 'Hospital'>('Doctor');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [compliment, setCompliment] = useState('');

  const handleSave = () => {
    const organizationData = referralType === 'Doctor' 
      ? { referralType, name, degree, compliment }
      : { referralType, name, compliment };
    onSave(organizationData);
    onClose();
  };

  return (
    <div className="w-full text-[#000000] bg-opacity-50 flex items-center justify-center">
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Organisation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <span className="text-red-500">*</span> Referral Type:
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={referralType === 'Doctor'}
                onChange={() => setReferralType('Doctor')}
              />
              <span className="ml-2">Doctor</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={referralType === 'Hospital'}
                onChange={() => setReferralType('Hospital')}
              />
              <span className="ml-2">Hospital</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <span className="text-red-500">*</span> Name:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>

        {referralType === 'Doctor' && (
          <div className="mb-4">
            <label className="block mb-2">Degree:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Degree"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2">Compliment%:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={compliment}
            onChange={(e) => setCompliment(e.target.value)}
            placeholder="Compliment"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddOrganization;
