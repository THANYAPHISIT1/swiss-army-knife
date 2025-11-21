import { useState, useEffect } from 'react';

export default function TokenCounter() {
  const [text, setText] = useState('');
  const [tokens, setTokens] = useState(0);
  const [chars, setChars] = useState(0);
  const [words, setWords] = useState(0);
  const [lines, setLines] = useState(0);

  // Simple token estimation (GPT-like: ~4 chars per token on average)
  // This is a rough approximation
  const estimateTokens = (text: string): number => {
    if (!text) return 0;

    // Count words and characters
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = text.length;

    // Heuristic: Average of word-based and character-based estimation
    // Words typically = tokens * 0.75 (since some words are split)
    // Characters typically = tokens * 4
    const tokensByWords = wordCount / 0.75;
    const tokensByChars = charCount / 4;

    // Use average of both methods
    return Math.round((tokensByWords + tokensByChars) / 2);
  };

  useEffect(() => {
    setChars(text.length);
    setWords(text.trim().split(/\s+/).filter(word => word.length > 0).length);
    setLines(text.split('\n').length);
    setTokens(estimateTokens(text));
  }, [text]);

  const estimatedCost = {
    gpt4: (tokens / 1000) * 0.03, // GPT-4 input pricing (approximate)
    gpt35: (tokens / 1000) * 0.0015, // GPT-3.5 input pricing (approximate)
    claude: (tokens / 1000) * 0.008, // Claude input pricing (approximate)
  };

  const clearText = () => {
    setText('');
  };

  const loadSample = () => {
    setText(`This is a sample text to test token counting.

Token counting is useful for:
- Estimating API costs for LLM services
- Planning prompt engineering within token limits
- Understanding how much context you can include

Different models have different tokenization methods, so this is an approximation.`);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Token Counter</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Estimate token count for LLM API usage
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={clearText}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {tokens.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tokens (est.)
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {chars.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Characters
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {words.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Words
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {lines.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Lines
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="mb-2 font-medium">Input Text:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to count tokens..."
          className="flex-1 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cost Estimation */}
      {tokens > 0 && (
        <div className="border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded p-4">
          <h3 className="font-medium mb-3">Estimated API Costs (Input):</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600 dark:text-gray-400">GPT-4</div>
              <div className="font-mono font-bold">${estimatedCost.gpt4.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">GPT-3.5</div>
              <div className="font-mono font-bold">${estimatedCost.gpt35.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Claude</div>
              <div className="font-mono font-bold">${estimatedCost.claude.toFixed(4)}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            * Prices are approximate and based on input tokens only. Output tokens cost more.
          </p>
        </div>
      )}

      {/* Token Limits Reference */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
        <h3 className="font-medium mb-2">Common Token Limits:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>GPT-3.5:</span>
            <span className="font-mono">4,096 tokens</span>
          </div>
          <div className="flex justify-between">
            <span>GPT-3.5-16K:</span>
            <span className="font-mono">16,384 tokens</span>
          </div>
          <div className="flex justify-between">
            <span>GPT-4:</span>
            <span className="font-mono">8,192 tokens</span>
          </div>
          <div className="flex justify-between">
            <span>GPT-4-32K:</span>
            <span className="font-mono">32,768 tokens</span>
          </div>
          <div className="flex justify-between">
            <span>Claude 3:</span>
            <span className="font-mono">200,000 tokens</span>
          </div>
          <div className="flex justify-between">
            <span>Claude 2:</span>
            <span className="font-mono">100,000 tokens</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">About Token Counting:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• This is an <strong>approximation</strong> based on heuristics</li>
          <li>• Different models use different tokenization methods</li>
          <li>• Actual token count may vary by ±20%</li>
          <li>• For exact counts, use the model's official tokenizer</li>
          <li>• Useful for quick estimates before making API calls</li>
        </ul>
      </div>
    </div>
  );
}
