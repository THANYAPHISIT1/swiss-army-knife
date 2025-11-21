import { useState } from 'react';
import * as yaml from 'js-yaml';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

type ConversionMode = 'json-to-yaml' | 'yaml-to-json';

export default function YamlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<ConversionMode>('json-to-yaml');

  const convert = () => {
    try {
      setError('');

      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input);
        const yamlOutput = yaml.dump(parsed, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });
        setOutput(yamlOutput);
      } else {
        const parsed = yaml.load(input);
        const jsonOutput = JSON.stringify(parsed, null, 2);
        setOutput(jsonOutput);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
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

  const swapMode = () => {
    setMode(mode === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">JSON ↔ YAML Converter</h2>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('json-to-yaml')}
            className={`px-4 py-2 rounded border transition-colors ${
              mode === 'json-to-yaml'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}
          >
            JSON → YAML
          </button>
          <button
            onClick={() => setMode('yaml-to-json')}
            className={`px-4 py-2 rounded border transition-colors ${
              mode === 'yaml-to-json'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}
          >
            YAML → JSON
          </button>
        </div>
        <button
          onClick={swapMode}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          title="Swap input/output and mode"
        >
          ⇄ Swap
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={convert}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        >
          Convert
        </button>
        {output && (
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
          >
            Copy Output
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col">
          <label className="mb-2 font-medium">
            Input ({mode === 'json-to-yaml' ? 'JSON' : 'YAML'})
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'json-to-yaml'
                ? 'Paste your JSON here...'
                : 'Paste your YAML here...'
            }
            className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium">
            Output ({mode === 'json-to-yaml' ? 'YAML' : 'JSON'})
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="Converted output will appear here..."
            className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-gray-50 dark:bg-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">About YAML:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• YAML (YAML Ain't Markup Language) is a human-readable data serialization format</li>
          <li>• Commonly used for configuration files (Kubernetes, Docker Compose, CI/CD)</li>
          <li>• Uses indentation to represent structure (like Python)</li>
          <li>• Supports comments (unlike JSON)</li>
        </ul>
      </div>
    </div>
  );
}
