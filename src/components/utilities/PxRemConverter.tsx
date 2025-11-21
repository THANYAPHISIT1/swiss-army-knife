import { useState, useEffect } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function PxRemConverter() {
  const [baseSize, setBaseSize] = useState(16);
  const [pxValue, setPxValue] = useState('');
  const [remValue, setRemValue] = useState('');
  const [mode, setMode] = useState<'px-to-rem' | 'rem-to-px'>('px-to-rem');

  useEffect(() => {
    convert();
  }, [pxValue, remValue, baseSize, mode]);

  const convert = () => {
    if (mode === 'px-to-rem') {
      const px = parseFloat(pxValue);
      if (!isNaN(px) && px > 0) {
        const rem = px / baseSize;
        setRemValue(rem.toFixed(4));
      } else {
        setRemValue('');
      }
    } else {
      const rem = parseFloat(remValue);
      if (!isNaN(rem) && rem > 0) {
        const px = rem * baseSize;
        setPxValue(px.toFixed(2));
      } else {
        setPxValue('');
      }
    }
  };

  const copyResult = async () => {
    try {
      const result = mode === 'px-to-rem' ? `${remValue}rem` : `${pxValue}px`;
      await writeText(result);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const commonSizes = [
    { px: 8, label: '8px' },
    { px: 12, label: '12px' },
    { px: 14, label: '14px' },
    { px: 16, label: '16px' },
    { px: 18, label: '18px' },
    { px: 20, label: '20px' },
    { px: 24, label: '24px' },
    { px: 32, label: '32px' },
    { px: 48, label: '48px' },
    { px: 64, label: '64px' },
  ];

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">PX to REM Converter</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Convert between pixels and rem units for responsive design
        </p>
      </div>

      {/* Base Font Size */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
        <label className="block mb-2 font-medium">Base Font Size (px):</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="10"
            max="24"
            value={baseSize}
            onChange={(e) => setBaseSize(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <input
            type="number"
            value={baseSize}
            onChange={(e) => setBaseSize(Number(e.target.value))}
            min="10"
            max="24"
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">px</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Default is 16px (browser default). Adjust if your project uses a different base size.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('px-to-rem')}
          className={`flex-1 px-4 py-2 rounded border transition-colors ${
            mode === 'px-to-rem'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}
        >
          PX → REM
        </button>
        <button
          onClick={() => setMode('rem-to-px')}
          className={`flex-1 px-4 py-2 rounded border transition-colors ${
            mode === 'rem-to-px'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}
        >
          REM → PX
        </button>
      </div>

      {/* Converter */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Pixels (px)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={pxValue}
              onChange={(e) => {
                setPxValue(e.target.value);
                setMode('px-to-rem');
              }}
              placeholder="Enter px value..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="flex items-center text-gray-600 dark:text-gray-400">px</span>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">REM</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={remValue}
              onChange={(e) => {
                setRemValue(e.target.value);
                setMode('rem-to-px');
              }}
              placeholder="Enter rem value..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="flex items-center text-gray-600 dark:text-gray-400">rem</span>
          </div>
        </div>
      </div>

      {(pxValue || remValue) && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded">
          <div className="flex-1">
            <span className="font-medium">Result: </span>
            <span className="font-mono">
              {mode === 'px-to-rem' ? `${pxValue}px = ${remValue}rem` : `${remValue}rem = ${pxValue}px`}
            </span>
          </div>
          <button
            onClick={copyResult}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
          >
            Copy
          </button>
        </div>
      )}

      {/* Common Sizes Reference */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
        <h3 className="font-medium mb-3">Common Sizes Reference</h3>
        <div className="grid grid-cols-5 gap-2">
          {commonSizes.map((size) => (
            <button
              key={size.px}
              onClick={() => {
                setPxValue(size.px.toString());
                setMode('px-to-rem');
              }}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              <div className="font-mono">{size.label}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {(size.px / baseSize).toFixed(2)}rem
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Why use REM?</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• REM scales based on root font size, making responsive design easier</li>
          <li>• Users can adjust their browser font size, and REM respects that</li>
          <li>• Better accessibility for visually impaired users</li>
          <li>• Consistent sizing across your application</li>
        </ul>
      </div>
    </div>
  );
}
