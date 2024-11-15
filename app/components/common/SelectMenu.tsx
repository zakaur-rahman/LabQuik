import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

interface SelectMenuProps {
  label: string;
  options: { id: string; name: string; type?: string }[];
  value: string;
  onChange: (value: string) => void;
  onAdd?: () => void;
  placeholder?: string;
  className?: string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  label,
  options,
  value,
  onChange,
  onAdd,
  placeholder = 'Select an option',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);


  console.log("options: ", options);
  // Validate options
  /* useEffect(() => {
    if (!Array.isArray(options) || options.length === 0) {
      console.error("Options must be a non-empty array.");
      setFilteredOptions([]); // Clear options if invalid
    } else {
      setFilteredOptions(options);
    }
  }, [options]); */

  useEffect(() => {
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchQuery, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (optionId: string) => {
    onChange(optionId);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={menuRef}>
      <label htmlFor={label} className="block text-sm mb-1">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div
            className={`w-full px-3 py-2 border rounded flex items-center ${className}`}
            onClick={handleInputClick}
          >
            <input
              ref={inputRef}
              type="text"
              className="flex-grow outline-none"
              placeholder={value ? options.find(opt => opt.id === value)?.name : placeholder}
              value={searchQuery}
              onChange={handleInputChange}
            />
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          {isOpen && filteredOptions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
              <ul className="max-h-60 overflow-auto">
                {filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    className={`px-3 py-2 cursor-pointer ${
                      option.id === value ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelectOption(option.id)}
                  >
                    <div>{option.name}</div>
                    {option.type && <div className="text-sm text-gray-500">{option.type}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isOpen && filteredOptions.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
              <div className="px-3 py-2 text-gray-500">No options available</div>
            </div>
          )}
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="p-2 bg-blue-500 text-white rounded"
            aria-label={`Add ${label}`}
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectMenu;
