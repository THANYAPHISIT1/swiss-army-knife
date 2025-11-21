import { useState, useMemo } from 'react';
import * as Diff from 'diff';

export default function DiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('split');

  const differences = useMemo(() => {
    if (!text1 && !text2) return null;
    return Diff.diffLines(text1, text2);
  }, [text1, text2]);

  const stats = useMemo(() => {
    if (!differences) return { added: 0, removed: 0, unchanged: 0 };

    let added = 0;
    let removed = 0;
    let unchanged = 0;

    differences.forEach((part) => {
      if (part.added) added += part.count || 0;
      else if (part.removed) removed += part.count || 0;
      else unchanged += part.count || 0;
    });

    return { added, removed, unchanged };
  }, [differences]);

  const clearAll = () => {
    setText1('');
    setText2('');
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Diff Checker</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Compare two texts and highlight differences
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={swapTexts}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            ⇄ Swap
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* View Mode */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View:</span>
        <button
          onClick={() => setViewMode('split')}
          className={`px-3 py-1.5 rounded border text-sm transition-colors ${
            viewMode === 'split'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}
        >
          Split
        </button>
        <button
          onClick={() => setViewMode('unified')}
          className={`px-3 py-1.5 rounded border text-sm transition-colors ${
            viewMode === 'unified'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}
        >
          Unified
        </button>
      </div>

      {/* Statistics */}
      {differences && (
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-medium">Added:</span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
              {stats.added}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Removed:</span>
            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
              {stats.removed}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Unchanged:</span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded">
              {stats.unchanged}
            </span>
          </div>
        </div>
      )}

      {viewMode === 'split' ? (
        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Original Text</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter original text..."
              className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium">Modified Text</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter modified text..."
              className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <label className="mb-2 font-medium">Unified Diff View</label>
          <div className="flex-1 overflow-auto border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 p-3">
            {differences ? (
              <div className="font-mono text-sm whitespace-pre-wrap">
                {differences.map((part, index) => (
                  <div
                    key={index}
                    className={`${
                      part.added
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : part.removed
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        : ''
                    }`}
                  >
                    <span className="select-none mr-2 text-gray-500">
                      {part.added ? '+' : part.removed ? '-' : ' '}
                    </span>
                    {part.value}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Enter text in both fields to see differences
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">How to use:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Paste your original text in the left field and modified text in the right</li>
          <li>• Green highlights show additions, red highlights show deletions</li>
          <li>• Switch between split and unified views for different perspectives</li>
          <li>• Useful for code reviews, document comparison, and debugging</li>
        </ul>
      </div>
    </div>
  );
}
