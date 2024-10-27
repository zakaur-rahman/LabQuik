interface MultipleFieldsEditorProps {
    onChange?: (value: string) => void;
    value?: string;
  }
  
  export const MultipleFieldsEditor: React.FC<MultipleFieldsEditorProps> = ({ onChange, value }) => {
    return (
      <div className="flex-1 border p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Field 1</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-1.5 text-sm"
              placeholder="Enter field name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Field 2</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-1.5 text-sm"
              placeholder="Enter field name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Field 3</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-1.5 text-sm"
              placeholder="Enter field name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Field 4</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-1.5 text-sm"
              placeholder="Enter field name"
            />
          </div>
        </div>
      </div>
    );
  };