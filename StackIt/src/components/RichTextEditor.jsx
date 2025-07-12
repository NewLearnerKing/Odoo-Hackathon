import { useState, useEffect, useRef } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const [editorValue, setEditorValue] = useState(value || '');
  const editorRef = useRef(null);

  useEffect(() => {
    if (value !== editorValue) {
      setEditorValue(value || '');
      if (editorRef.current) {
        if (!value) {
          editorRef.current.innerHTML = `<span class="placeholder">${placeholder}</span>`;
        } else {
          editorRef.current.innerHTML = value;
        }
      }
    }
  }, [value, placeholder]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      // Remove placeholder from content if it exists
      const cleanContent = content.replace(`<span class="placeholder">${placeholder}</span>`, '');
      // Only update if content actually changed to prevent cursor jumping
      if (cleanContent !== editorValue) {
        setEditorValue(cleanContent);
        if (onChange) {
          onChange(cleanContent);
        }
      }
    }
  };

  const handleFocus = () => {
    if (editorRef.current && editorRef.current.innerHTML === `<span class="placeholder">${placeholder}</span>`) {
      editorRef.current.innerHTML = '';
    }
  };

  const handleBlur = () => {
    if (editorRef.current && !editorRef.current.innerHTML.trim()) {
      editorRef.current.innerHTML = `<span class="placeholder">${placeholder}</span>`;
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertText = (text) => {
    document.execCommand('insertText', false, text);
    editorRef.current?.focus();
    handleInput();
  };

  const insertCodeBlock = () => {
    const codeBlock = '<pre><code>Your code here</code></pre>';
    document.execCommand('insertHTML', false, codeBlock);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      editorRef.current?.focus();
      handleInput();
    }
  };

  const ToolbarButton = ({ onClick, children, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rich-text-editor bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap gap-1">
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.6 18c-.38 0-.75-.15-1.03-.42L9 14.94l-2.57 2.64c-.28.27-.65.42-1.03.42-.38 0-.75-.15-1.03-.42-.56-.58-.56-1.5 0-2.08L7.94 12 4.37 8.42c-.56-.58-.56-1.5 0-2.08.28-.27.65-.42 1.03-.42.38 0 .75.15 1.03.42L9 9.06l2.57-2.64c.28-.27.65-.42 1.03-.42.38 0 .75.15 1.03.42.56.58.56 1.5 0 2.08L10.06 12l3.57 3.58c.56.58.56 1.5 0 2.08-.28.27-.65.42-1.03.42z"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 4a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a1 1 0 110 2 5.99 5.99 0 01-4.957-2.639l-1.626-5.083-1.261.63a1 1 0 01-.894-1.79l1.599-.8L9 6.323V7a1 1 0 01-1 1H6a1 1 0 010-2h3z"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertLink} title="Insert Link">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={insertCodeBlock} title="Insert Code Block">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => insertText('# ')} title="Heading 1">
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('## ')} title="Heading 2">
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('### ')} title="Heading 3">
            H3
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        onKeyDown={(e) => {
          // Handle backspace properly
          if (e.key === 'Backspace') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              if (range.collapsed && range.startOffset === 0) {
                // Prevent backspace at the beginning
                e.preventDefault();
              }
            }
          }
        }}
        className="min-h-[200px] p-4 text-gray-700 text-base leading-relaxed focus:outline-none focus:ring-0"
        style={{ 
          fontFamily: 'inherit',
          fontSize: '16px',
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
      />

      {/* Tips */}
      <div className="bg-blue-50 border-t border-blue-200 p-3">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Formatting Tips:</p>
            <ul className="text-xs space-y-1">
              <li>• Use <kbd className="bg-blue-100 px-1 rounded">Ctrl+B</kbd> for bold, <kbd className="bg-blue-100 px-1 rounded">Ctrl+I</kbd> for italic</li>
              <li>• Add # at the beginning of a line for headings</li>
              <li>• Use the toolbar buttons for quick formatting</li>
              <li>• Paste plain text to avoid formatting issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor; 