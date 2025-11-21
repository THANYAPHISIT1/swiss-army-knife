import { useState } from 'react';
import { format } from 'sql-formatter';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

type SqlLanguage = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<SqlLanguage>('sql');
  const [indentSize, setIndentSize] = useState(2);
  const [uppercase, setUppercase] = useState(true);

  const formatSql = () => {
    try {
      setError('');
      const formatted = format(input, {
        language,
        tabWidth: indentSize,
        keywordCase: uppercase ? 'upper' : 'lower',
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to format SQL');
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
        <h2 className="text-xl font-semibold">SQL Formatter</h2>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">SQL Dialect:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SqlLanguage)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sql">Standard SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlite">SQLite</option>
            <option value="tsql">T-SQL (SQL Server)</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Indent Size:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Keyword Case:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUppercase(true)}
              className={`flex-1 px-3 py-2 rounded border transition-colors ${
                uppercase
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            >
              UPPER
            </button>
            <button
              onClick={() => setUppercase(false)}
              className={`flex-1 px-3 py-2 rounded border transition-colors ${
                !uppercase
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            >
              lower
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={formatSql}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Format SQL
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

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Input SQL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium">Formatted SQL</label>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted SQL will appear here..."
            className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-gray-50 dark:bg-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Features:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Automatically indents and formats SQL queries for readability</li>
          <li>• Supports multiple SQL dialects (MySQL, PostgreSQL, SQLite, T-SQL)</li>
          <li>• Customizable indentation and keyword casing</li>
          <li>• Useful for debugging and reviewing complex queries</li>
        </ul>
      </div>
    </div>
  );
}
