import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function UuidGenerator() {
  const [uuidV4, setUuidV4] = useState('');
  const [uuidV7, setUuidV7] = useState('');
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkUuids, setBulkUuids] = useState<string[]>([]);
  const [bulkVersion, setBulkVersion] = useState<'v4' | 'v7'>('v4');

  const generateV4 = async () => {
    try {
      const uuid = await invoke<string>('generate_uuid_v4');
      setUuidV4(uuid);
    } catch (e) {
      console.error('Failed to generate UUID v4:', e);
    }
  };

  const generateV7 = async () => {
    try {
      const uuid = await invoke<string>('generate_uuid_v7');
      setUuidV7(uuid);
    } catch (e) {
      console.error('Failed to generate UUID v7:', e);
    }
  };

  const generateBulk = async () => {
    try {
      const uuids: string[] = [];
      const command = bulkVersion === 'v4' ? 'generate_uuid_v4' : 'generate_uuid_v7';

      for (let i = 0; i < bulkCount; i++) {
        const uuid = await invoke<string>(command);
        uuids.push(uuid);
      }
      setBulkUuids(uuids);
    } catch (e) {
      console.error('Failed to generate bulk UUIDs:', e);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await writeText(text);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const copyBulk = async () => {
    try {
      await writeText(bulkUuids.join('\n'));
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">UUID Generator</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Generate universally unique identifiers (UUID) v4 and v7
        </p>
      </div>

      {/* UUID v4 */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">UUID v4 (Random)</h3>
          <button
            onClick={generateV4}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Generate
          </button>
        </div>
        {uuidV4 && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={uuidV4}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(uuidV4)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Copy
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500">
          Random UUID - Best for general-purpose unique identifiers
        </p>
      </div>

      {/* UUID v7 */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">UUID v7 (Time-based)</h3>
          <button
            onClick={generateV7}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Generate
          </button>
        </div>
        {uuidV7 && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={uuidV7}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(uuidV7)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Copy
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500">
          Time-ordered UUID - Sortable by creation time, better for databases
        </p>
      </div>

      {/* Bulk Generation */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-3">
        <h3 className="font-medium">Bulk Generation</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-2 text-sm">Count:</label>
            <input
              type="number"
              value={bulkCount}
              onChange={(e) => setBulkCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm">Version:</label>
            <select
              value={bulkVersion}
              onChange={(e) => setBulkVersion(e.target.value as 'v4' | 'v7')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="v4">v4 (Random)</option>
              <option value="v7">v7 (Time-based)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateBulk}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors whitespace-nowrap"
            >
              Generate
            </button>
          </div>
        </div>

        {bulkUuids.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{bulkUuids.length} UUIDs generated</span>
              <button
                onClick={copyBulk}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                Copy All
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-2 bg-gray-50 dark:bg-gray-900">
              {bulkUuids.map((uuid, index) => (
                <div
                  key={index}
                  className="font-mono text-xs py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => copyToClipboard(uuid)}
                >
                  {uuid}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>UUID v4:</strong> Randomly generated, 122 random bits</p>
        <p><strong>UUID v7:</strong> Unix timestamp-based, sortable, better for database indexes</p>
      </div>
    </div>
  );
}
