
interface MultipleFieldsEditorProps {
    onChange?: (value: string) => void;
    value?: string;
  }

export const TextEditor: React.FC<MultipleFieldsEditorProps> = ({ onChange, value }) => {
    return (
      <div className="flex-1 border p-4">
        <textarea
          className="w-full h-64 border rounded px-3 py-1.5 text-sm"
          placeholder="Enter your text here..."
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    );
  };