import { useState, useEffect } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

const STORAGE_KEY = 'smart-scratchpad-content';

export default function SmartScratchpad() {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Load content from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { content: savedContent, timestamp } = JSON.parse(saved);
        setContent(savedContent);
        setLastSaved(new Date(timestamp));
        updateCounts(savedContent);
      } catch (e) {
        console.error('Failed to load saved content:', e);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (content !== undefined) {
      const timer = setTimeout(() => {
        const timestamp = new Date();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ content, timestamp: timestamp.toISOString() })
        );
        setLastSaved(timestamp);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timer);
    }
  }, [content]);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
    setWordCount(words.length);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    updateCounts(value);
  };

  const copyToClipboard = async () => {
    try {
      await writeText(content);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const clearContent = () => {
    if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
      setContent('');
      setCharCount(0);
      setWordCount(0);
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      setContent(formatted);
      updateCounts(formatted);
    } catch (e) {
      alert('Invalid JSON: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(content);
      const minified = JSON.stringify(parsed);
      setContent(minified);
      updateCounts(minified);
    } catch (e) {
      alert('Invalid JSON: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  const formatXML = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'application/xml');

      if (doc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML');
      }

      const serializer = new XMLSerializer();
      let formatted = serializer.serializeToString(doc);

      // Simple formatting (indentation)
      formatted = formatted.replace(/></g, '>\n<');

      setContent(formatted);
      updateCounts(formatted);
    } catch (e) {
      alert('Invalid XML: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  const toUpperCase = () => {
    setContent(content.toUpperCase());
  };

  const toLowerCase = () => {
    setContent(content.toLowerCase());
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Smart Scratchpad</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Auto-saving notepad with quick formatting tools
          </p>
        </div>
        {lastSaved && (
          <div className="text-xs text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={formatJSON}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          Format JSON
        </button>
        <button
          onClick={minifyJSON}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
        >
          Minify JSON
        </button>
        <button
          onClick={formatXML}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
        >
          Format XML
        </button>
        <div className="flex-1" />
        <button
          onClick={toUpperCase}
          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
        >
          UPPERCASE
        </button>
        <button
          onClick={toLowerCase}
          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
        >
          lowercase
        </button>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
        >
          Copy
        </button>
        <button
          onClick={clearContent}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Text Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing... Your content is automatically saved."
          className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium">Characters:</span> {charCount.toLocaleString()}
        </div>
        <div>
          <span className="font-medium">Words:</span> {wordCount.toLocaleString()}
        </div>
        <div>
          <span className="font-medium">Lines:</span>{' '}
          {content.split('\n').length.toLocaleString()}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Features:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Auto-saves your content every 500ms to local storage</li>
          <li>• Content persists even after closing the app</li>
          <li>• Quick formatting for JSON and XML</li>
          <li>• Text transformation (uppercase/lowercase)</li>
          <li>• Character, word, and line count</li>
        </ul>
      </div>
    </div>
  );
}
