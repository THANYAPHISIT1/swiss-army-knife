import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [md5Hash, setMd5Hash] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');

  const generateHashes = async () => {
    if (!input) return;

    try {
      const [md5, sha256, sha512] = await Promise.all([
        invoke<string>('generate_hash', { text: input, algorithm: 'md5' }),
        invoke<string>('generate_hash', { text: input, algorithm: 'sha256' }),
        invoke<string>('generate_hash', { text: input, algorithm: 'sha512' }),
      ]);

      setMd5Hash(md5);
      setSha256Hash(sha256);
      setSha512Hash(sha512);
    } catch (e) {
      console.error('Failed to generate hash:', e);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await writeText(text);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const clearAll = () => {
    setInput('');
    setMd5Hash('');
    setSha256Hash('');
    setSha512Hash('');
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Hash Generator</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Generate MD5, SHA-256, and SHA-512 hashes
          </p>
        </div>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <label className="block font-medium">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateHashes}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Generate Hashes
        </button>
      </div>

      {md5Hash && (
        <div className="space-y-4">
          {/* MD5 */}
          <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">MD5</h3>
              <button
                onClick={() => copyToClipboard(md5Hash)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
              {md5Hash}
            </div>
            <p className="text-xs text-gray-500">
              128-bit hash - Not recommended for security purposes
            </p>
          </div>

          {/* SHA-256 */}
          <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">SHA-256</h3>
              <button
                onClick={() => copyToClipboard(sha256Hash)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
              {sha256Hash}
            </div>
            <p className="text-xs text-gray-500">
              256-bit hash - Secure for most applications
            </p>
          </div>

          {/* SHA-512 */}
          <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">SHA-512</h3>
              <button
                onClick={() => copyToClipboard(sha512Hash)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
              {sha512Hash}
            </div>
            <p className="text-xs text-gray-500">
              512-bit hash - Maximum security
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">About Hash Functions:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Hash functions create fixed-size outputs from variable-size inputs</li>
          <li>• Same input always produces the same hash</li>
          <li>• One-way function - cannot reverse to get original input</li>
          <li>• Use SHA-256 or SHA-512 for cryptographic security</li>
        </ul>
      </div>
    </div>
  );
}
