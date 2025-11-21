import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const copyToClipboard = async (text: string) => {
    try {
      await writeText(text);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Color Picker</h2>
      </div>

      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <HexColorPicker color={color} onChange={setColor} />
        </div>

        <div className="flex-1 space-y-4">
          {/* Color Preview */}
          <div>
            <label className="block mb-2 font-medium">Preview</label>
            <div
              className="w-full h-24 rounded border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* HEX */}
          <div>
            <label className="block mb-2 font-medium">HEX</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={color.toUpperCase()}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => copyToClipboard(color.toUpperCase())}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* RGB */}
          {rgb && (
            <div>
              <label className="block mb-2 font-medium">RGB</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 font-mono"
                />
                <button
                  onClick={() =>
                    copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
                  }
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* HSL */}
          {hsl && (
            <div>
              <label className="block mb-2 font-medium">HSL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 font-mono"
                />
                <button
                  onClick={() =>
                    copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)
                  }
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Individual RGB values */}
          {rgb && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Red
                </label>
                <input
                  type="text"
                  value={rgb.r}
                  readOnly
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-center font-mono text-sm"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Green
                </label>
                <input
                  type="text"
                  value={rgb.g}
                  readOnly
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-center font-mono text-sm"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Blue
                </label>
                <input
                  type="text"
                  value={rgb.b}
                  readOnly
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-center font-mono text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
