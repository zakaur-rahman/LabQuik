import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TinyEditor: React.FC<TinyEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      apiKey='d2v435e7rpodkk3uce0wayuj7l2wvmj6q9qtw4yyi9uaqqyw'
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: true,
        branding: false,
        statusbar: true,
        plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars',
        toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | print | image  template link anchor codesample | ltr rtl',
        toolbar_sticky: true,
        toolbar_sticky_offset: 0,
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        importcss_append: true,
        templates: [
          { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
          { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
          { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
        ],
        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image table',
        skin: 'oxide',
        content_css: 'default',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            padding: 1rem;
          }
        `,
        table_default_attributes: {
          border: '1'
        },
        table_default_styles: {
          'border-collapse': 'collapse',
          'width': '100%'
        },
        table_responsive_width: true,
        table_sizing_mode: 'relative',
        table_resize_bars: true,
        table_cell_advtab: true,
        table_row_advtab: true,
        table_advtab: true,
        file_picker_callback: (callback, value, meta) => {
          // Implement file picker functionality if needed
        },
      }}
    />
  );
};

export default TinyEditor; 