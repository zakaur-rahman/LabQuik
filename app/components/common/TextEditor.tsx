import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table,
  Image,
  List,
  Minus,
  Plus,
  Type,
  Paintbrush,
} from 'lucide-react';

const RichTextEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
    }
  }, []);

  const ToolbarButton = ({
    icon: Icon,
    tooltip,
    command,
    value,
    active = false,
  }: {
    icon: React.ElementType;
    tooltip: string;
    command: string;
    value?: string;
    active?: boolean;
  }) => (
    <div className="relative group">
      <button
        type="button"
        aria-label={tooltip}
        className={`p-2 rounded hover:bg-gray-100 ${active ? 'bg-gray-200' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          executeCommand(command, value);
        }}
      >
        <Icon className="w-4 h-4" />
      </button>
      <div className="absolute hidden group-hover:block top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap z-50">
        {tooltip}
      </div>
    </div>
  );

  const Dropdown = ({
    trigger,
    content,
    isOpen,
    onToggle,
  }: {
    trigger: React.ReactNode;
    content: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
        onClick={() => onToggle()}
      >
        {trigger}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          {content}
        </div>
      )}
    </div>
  );

  const ColorButton = ({ color, onClick }: { color: string; onClick: () => void }) => (
    <button
      className="w-6 h-6 rounded hover:opacity-80"
      style={{ backgroundColor: color }}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    />
  );

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="border-b p-2 flex flex-wrap gap-1 items-center bg-white">
        {/* Undo/Redo */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton icon={Undo} tooltip="Undo" command="undo" />
          <ToolbarButton icon={Redo} tooltip="Redo" command="redo" />
        </div>

        {/* Text Style Dropdown */}
        <Dropdown
          trigger={
            <>
              <Type className="w-4 h-4" />
              <span>Paragraph</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </>
          }
          content={
            <div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  executeCommand('formatBlock', 'p');
                  setOpenDropdown(null);
                }}
              >
                Paragraph
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  executeCommand('formatBlock', 'h1');
                  setOpenDropdown(null);
                }}
              >
                Heading 1
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  executeCommand('formatBlock', 'h2');
                  setOpenDropdown(null);
                }}
              >
                Heading 2
              </button>
            </div>
          }
          isOpen={openDropdown === 'style'}
          onToggle={() => setOpenDropdown(openDropdown === 'style' ? null : 'style')}
        />

        {/* Font Size */}
        <div className="flex items-center gap-1 border-l border-r px-2">
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Decrease font size"
            onClick={() => {
              const newSize = Math.max(8, fontSize - 2);
              setFontSize(newSize);
              executeCommand('fontSize', newSize.toString());
            }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center">{fontSize}</span>
          <button
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Increase font size"
            onClick={() => {
              const newSize = Math.min(72, fontSize + 2);
              setFontSize(newSize);
              executeCommand('fontSize', newSize.toString());
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton icon={Bold} tooltip="Bold" command="bold" />
          <ToolbarButton icon={Italic} tooltip="Italic" command="italic" />
          <ToolbarButton icon={Underline} tooltip="Underline" command="underline" />
        </div>

        {/* Text Color & Background */}
        <div className="flex gap-1 border-r pr-2">
          <Dropdown
            trigger={<Type className="w-4 h-4" />}
            content={
              <div className="grid grid-cols-5 gap-1 p-2">
                {['black', 'red', 'blue', 'green', 'purple'].map((color) => (
                  <ColorButton
                    key={color}
                    color={color}
                    onClick={() => {
                      executeCommand('foreColor', color);
                      setOpenDropdown(null);
                    }}
                  />
                ))}
              </div>
            }
            isOpen={openDropdown === 'textColor'}
            onToggle={() => setOpenDropdown(openDropdown === 'textColor' ? null : 'textColor')}
          />
          <Dropdown
            trigger={<Paintbrush className="w-4 h-4" />}
            content={
              <div className="grid grid-cols-5 gap-1 p-2">
                {['yellow', 'lime', 'cyan', 'pink', 'orange'].map((color) => (
                  <ColorButton
                    key={color}
                    color={color}
                    onClick={() => {
                      executeCommand('hiliteColor', color);
                      setOpenDropdown(null);
                    }}
                  />
                ))}
              </div>
            }
            isOpen={openDropdown === 'bgColor'}
            onToggle={() => setOpenDropdown(openDropdown === 'bgColor' ? null : 'bgColor')}
          />
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton icon={AlignLeft} tooltip="Align left" command="justifyLeft" />
          <ToolbarButton icon={AlignCenter} tooltip="Align center" command="justifyCenter" />
          <ToolbarButton icon={AlignRight} tooltip="Align right" command="justifyRight" />
          <ToolbarButton icon={AlignJustify} tooltip="Justify" command="justifyFull" />
        </div>

        {/* Insert */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton
            icon={Table}
            tooltip="Insert table"
            command="insertHTML"
            value="<table><tr><td></td></tr></table>"
          />
          <ToolbarButton icon={Image} tooltip="Insert image" command="insertImage" value="https://via.placeholder.com/150" />
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <ToolbarButton icon={List} tooltip="Bullet list" command="insertUnorderedList" />
          <ToolbarButton icon={List} tooltip="Numbered list" command="insertOrderedList" />
        </div>
      </div>

      <div
        contentEditable
        ref={editorRef}
        className="p-4 h-64 overflow-y-auto border-t bg-white empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{ fontSize: `${fontSize}px` }}
        data-placeholder="Type here..."
      />
    </div>
  );
};

export default RichTextEditor;
