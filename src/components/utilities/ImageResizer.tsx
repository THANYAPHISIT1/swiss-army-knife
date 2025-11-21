import { useState } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

interface ImageInfo {
  width: number;
  height: number;
  format: string;
}

export default function ImageResizer() {
  const [inputPath, setInputPath] = useState('');
  const [inputInfo, setInputInfo] = useState<ImageInfo | null>(null);
  const [resizeMode, setResizeMode] = useState<'pixel' | 'percentage'>('pixel');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percentage, setPercentage] = useState('100');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [outputInfo, setOutputInfo] = useState<ImageInfo | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const selectImage = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif'],
          },
        ],
      });

      if (selected) {
        setInputPath(selected as string);
        const info = await invoke<ImageInfo>('get_image_info', {
          filePath: selected,
        });
        setInputInfo(info);
        setWidth(info.width.toString());
        setHeight(info.height.toString());
        setError('');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load image');
    }
  };

  const resizeImage = async () => {
    if (!inputPath) {
      setError('Please select an image first');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const savePath = await save({
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'],
          },
        ],
      });

      if (!savePath) {
        setProcessing(false);
        return;
      }

      const options =
        resizeMode === 'percentage'
          ? {
              percentage: parseFloat(percentage),
              width: null,
              height: null,
              maintain_aspect: true,
            }
          : {
              percentage: null,
              width: width ? parseInt(width) : null,
              height: height ? parseInt(height) : null,
              maintain_aspect: maintainAspect,
            };

      const result = await invoke<ImageInfo>('resize_image', {
        inputPath,
        outputPath: savePath,
        options,
      });

      setOutputInfo(result);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to resize image');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Image Resizer</h2>
        <button
          onClick={selectImage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Select Image
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {inputInfo && (
        <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-3">
          <h3 className="font-medium">Input Image</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Width:</span>{' '}
              <span className="font-mono">{inputInfo.width}px</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Height:</span>{' '}
              <span className="font-mono">{inputInfo.height}px</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Format:</span>{' '}
              <span className="font-mono">{inputInfo.format}</span>
            </div>
          </div>
        </div>
      )}

      {inputPath && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setResizeMode('pixel')}
              className={`flex-1 px-4 py-2 rounded border transition-colors ${
                resizeMode === 'pixel'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            >
              Pixel
            </button>
            <button
              onClick={() => setResizeMode('percentage')}
              className={`flex-1 px-4 py-2 rounded border transition-colors ${
                resizeMode === 'percentage'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            >
              Percentage
            </button>
          </div>

          {resizeMode === 'pixel' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="maintain-aspect"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="maintain-aspect" className="text-sm">
                  Maintain aspect ratio
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Width"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Height"
                    disabled={maintainAspect}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block mb-2 text-sm font-medium">Scale (%)</label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {inputInfo &&
                  `New size: ${Math.round((inputInfo.width * parseFloat(percentage)) / 100)}x${Math.round(
                    (inputInfo.height * parseFloat(percentage)) / 100
                  )}px`}
              </p>
            </div>
          )}

          <button
            onClick={resizeImage}
            disabled={processing}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Resize & Save'}
          </button>
        </div>
      )}

      {outputInfo && (
        <div className="border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded p-4 space-y-2">
          <h3 className="font-medium text-green-800 dark:text-green-200">Success!</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">New dimensions:</span>{' '}
              <span className="font-mono">
                {outputInfo.width}x{outputInfo.height}px
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Format:</span>{' '}
              <span className="font-mono">{outputInfo.format}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
