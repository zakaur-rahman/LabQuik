import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface DropdownProps {
  label?: string;
  placeholder?: string;
  onOptionsChange?: (options: string[]) => void;
  onDefaultOptionChange?: (option: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  label = "Options",
  placeholder = "Create Options",
  onOptionsChange,
  onDefaultOptionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [options, setOptions] = useState([
    "Present",
    "Reactive",
    "Non-Reactive",
    "Sensitive",
    "Resistant",
    "Intermediate"
  ]);
  const [newOption, setNewOption] = useState("");
  const [defaultOption, setDefaultOption] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (onOptionsChange) {
      onOptionsChange(selectedOptions);
    }
  }, [selectedOptions, onOptionsChange]);

  useEffect(() => {
    if (onDefaultOptionChange) {
      onDefaultOptionChange(defaultOption);
    }
  }, [defaultOption, onDefaultOptionChange]);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      setSelectedOptions([...selectedOptions, newOption.trim()]);
      setNewOption("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newOption.trim()) {
      handleAddOption();
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const removeOption = (optionToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    setSelectedOptions(prev => prev.filter(option => option !== optionToRemove));
    if (defaultOption === optionToRemove) {
      setDefaultOption("");
    }
  };

  const handleDefaultOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaultOption(e.target.value);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full border rounded px-3 py-1.5 text-sm relative bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <span
              key={option}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs"
            >
              {option}
              <button
                title="Remove Option"
                onClick={(e) => removeOption(option, e)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedOptions.length === 0 && (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul
            className="py-1 overflow-auto max-h-60"
            role="listbox"
            tabIndex={-1}
            aria-multiselectable="true"
          >
            {options.map((option) => (
              <li
                key={option}
                className={`px-3 py-1.5 cursor-pointer hover:bg-gray-50 flex items-center justify-between text-sm ${
                  selectedOptions.includes(option) ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleOption(option)}
                role="option"
                aria-selected={selectedOptions.includes(option)}
              >
                <span>{option}</span>
                {selectedOptions.includes(option) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </li>
            ))}
          </ul>
          
          <div className="p-2 border-t border-gray-300">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Please enter item"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                onClick={handleAddOption}
                className="whitespace-nowrap px-2 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md flex items-center text-sm"
                disabled={!newOption.trim()}
              >
                <span className="mr-1">+</span>
                Add item
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-2">
        <label className="text-sm text-gray-600 mb-1">Default Option:</label>
        <select
          title="Default Option"
          value={defaultOption}
          onChange={handleDefaultOptionChange}
          className="w-full border rounded px-3 py-1.5 text-sm"
        >
          <option value="">Select Default Option</option>
          {selectedOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomDropdown;
