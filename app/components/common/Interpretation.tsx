import React, { useState } from 'react';
import TinyEditor from '../editor/TinyEditor';
import { XIcon } from 'lucide-react';

interface InterpretationProps {
  onClose: () => void;
  onSave: (data: any) => void;
  interpretation: string;
  setOpen: (open: boolean) => void;
}

const Interpretation: React.FC<InterpretationProps> = ({ onClose, onSave, setOpen, interpretation }) => {
  const [content, setContent] = useState(interpretation);

  const handleSave = () => {
    onSave({ content });
    setOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test Interpretation</h2>
        <button
          title="Close"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <TinyEditor 
          value={content} 
          onChange={(newContent) => setContent(newContent)} 
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Interpretation;
