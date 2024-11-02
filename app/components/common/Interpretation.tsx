import React, { useState } from 'react';
import { X, ChevronDown, MoreHorizontal, Bold, Italic, Underline, AlignLeft } from 'lucide-react';

const Interpretation = () => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState("14px");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-4xl text-black rounded-lg  border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Interpretation</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-2 border-b border-gray-200">
        {/* Format dropdown */}
        <div className="flex items-center border rounded px-2 py-1 hover:bg-gray-50">
          <span className="text-sm mr-2">Paragraph</span>
          <ChevronDown size={16} />
        </div>

        {/* Font size controls */}
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-100 rounded">-</button>
          <span className="text-sm">{fontSize}</span>
          <button className="p-1 hover:bg-gray-100 rounded">+</button>
        </div>

        {/* Formatting buttons */}
        <div className="flex items-center space-x-1 border-l border-r px-2 mx-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Bold size={18} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Italic size={18} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Underline size={18} />
          </button>
        </div>

        {/* Alignment controls */}
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <AlignLeft size={18} />
          </button>
        </div>

        {/* More options */}
        <button className="p-1 hover:bg-gray-100 rounded ml-auto">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Text area */}
      <div className="p-4">
        <textarea
          className="w-full h-48 p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">{wordCount} words</span>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interpretation;
