import { useState, useMemo } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');

  const results = useMemo(() => {
    if (!pattern || !testString) return null;

    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(testString.matchAll(regex));
      setError('');
      return matches;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex');
      return null;
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (!results || results.length === 0) {
      return [{ text: testString, isMatch: false }];
    }

    const parts: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    results.forEach((match) => {
      const index = match.index ?? 0;
      // Add non-matching part
      if (index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, index), isMatch: false });
      }
      // Add matching part
      parts.push({ text: match[0], isMatch: true });
      lastIndex = index + match[0].length;
    });

    // Add remaining text
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false });
    }

    return parts;
  }, [results, testString]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Regex Tester</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block mb-2 font-medium">Regular Expression</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <span className="text-gray-600 dark:text-gray-400">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {['g', 'i', 'm', 's', 'u', 'y'].map((flag) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`px-3 py-1 rounded border transition-colors ${
                flags.includes(flag)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
              title={getFlagDescription(flag)}
            >
              {flag}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200">
            {error}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <label className="mb-2 font-medium">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against regex..."
          className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {results && (
          <div className="space-y-3">
            <div>
              <label className="block mb-2 font-medium">
                Matches: {results.length}
              </label>
              <div className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 font-mono text-sm whitespace-pre-wrap break-all">
                {highlightedText.map((part, index) => (
                  <span
                    key={index}
                    className={
                      part.isMatch
                        ? 'bg-yellow-300 dark:bg-yellow-600 px-0.5'
                        : ''
                    }
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </div>

            {results.length > 0 && (
              <div>
                <label className="block mb-2 font-medium">Match Details</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {results.map((match, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                    >
                      <div className="font-medium">Match {index + 1}:</div>
                      <div className="font-mono">{match[0]}</div>
                      {match.length > 1 && (
                        <div className="mt-1 text-gray-600 dark:text-gray-400">
                          Groups: {match.slice(1).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getFlagDescription(flag: string): string {
  const descriptions: Record<string, string> = {
    g: 'Global - find all matches',
    i: 'Case insensitive',
    m: 'Multiline - ^ and $ match line breaks',
    s: 'Dot all - . matches newlines',
    u: 'Unicode',
    y: 'Sticky - match from lastIndex',
  };
  return descriptions[flag] || '';
}
