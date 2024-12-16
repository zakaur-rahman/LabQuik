'use client';
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false, loading: () => <div>Loading editor...</div> }
);

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = '',
}) => {
  const quillRef = useRef<any>(null);

  // Custom undo/redo icons
  const icons = {
    undo: `<svg viewbox="0 0 18 18">
      <path fill="currentColor" d="M12.5,8.5c0,0-1.5-1.5-5-1.5v3l-6-4l6-4v3c4.5,0,7,2.5,7,2.5L12.5,8.5z"/>
    </svg>`,
    redo: `<svg viewbox="0 0 18 18">
      <path fill="currentColor" d="M10.5,7c-3.5,0-5,1.5-5,1.5L3.5,7.5C3.5,7.5,6,5,10.5,5v-3l6,4l-6,4V7z"/>
    </svg>`,
  };

  // Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        ['undo', 'redo'],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
      ],
      handlers: {
        undo: function() {
          // @ts-ignore
          this.quill.history.undo();
        },
        redo: function() {
          // @ts-ignore
          this.quill.history.redo();
        },
      },
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
    keyboard: {
      bindings: {
        custom_undo: {
          key: 'Z',
          shortKey: true,
          handler: function(range: any, context: any) {
            // @ts-ignore
            this.quill.history.undo();
          },
        },
        custom_redo: {
          key: 'Z',
          shortKey: true,
          shiftKey: true,
          handler: function(range: any, context: any) {
            // @ts-ignore
            this.quill.history.redo();
          },
        },
      },
    },
  };

  // Quill formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet', 'check',
    'script',
    'indent',
    'direction',
    'size',
    'color', 'background',
    'font',
    'align',
    'link', 'image',
    'clean',
  ];

  useEffect(() => {
    if (quillRef.current) {
      // Register custom icons
      const Quill = quillRef.current.getEditor();
      Object.keys(icons).forEach(icon => {
        // @ts-ignore
        Quill.ui.icons[icon] = icons[icon];
      });
    }
  }, []);

  return (
    <div className={`quill-editor ${className}`}>
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default QuillEditor; 