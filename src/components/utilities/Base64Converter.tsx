import { useState } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Encoding failed');
      setOutput('');
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid Base64 string');
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await writeText(output);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Base64 Encoder/Decoder</h2>
      </div>

      <div className="flex gap-2">
        <button
          onClick={encode}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Encode
        </button>
        <button
          onClick={decode}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        >
          Decode
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Clear
        </button>
        {output && (
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            Copy Output
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or Base64 to decode..."
            className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium">Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-gray-50 dark:bg-gray-900 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
