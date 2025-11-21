import { useState } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

interface ImageInfo {
  width: number;
  height: number;
  format: string;
}

const SUPPORTED_FORMATS = [
  { value: 'jpg', label: 'JPEG (.jpg)' },
  { value: 'png', label: 'PNG (.png)' },
  { value: 'webp', label: 'WebP (.webp)' },
  { value: 'gif', label: 'GIF (.gif)' },
  { value: 'bmp', label: 'BMP (.bmp)' },
  { value: 'tiff', label: 'TIFF (.tiff)' },
  { value: 'ico', label: 'ICO (.ico)' },
];

export default function ImageConverter() {
  const [inputPath, setInputPath] = useState('');
  const [inputInfo, setInputInfo] = useState<ImageInfo | null>(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [outputInfo, setOutputInfo] = useState<ImageInfo | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const loadImage = async (path: string) => {
    try {
      const info = await invoke<ImageInfo>('get_image_info', {
        filePath: path,
      });
      setInputPath(path);
      setInputInfo(info);
      setError('');
      setOutputInfo(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load image');
    }
  };

  const selectImage = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'ico', 'svg'],
          },
        ],
      });

      if (selected) {
        await loadImage(selected as string);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to select image');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // In Tauri, we need to use the file path
        // For drag and drop, we'll need to handle this differently
        setError('Drag and drop is not yet supported. Please use the select button.');
      } else {
        setError('Please drop an image file');
      }
    }
  };

  const convertImage = async () => {
    if (!inputPath) {
      setError('Please select an image first');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const defaultName = inputPath.split('/').pop()?.split('.')[0] || 'converted';
      const savePath = await save({
        defaultPath: `${defaultName}.${outputFormat}`,
        filters: [
          {
            name: 'Images',
            extensions: [outputFormat],
          },
        ],
      });

      if (!savePath) {
        setProcessing(false);
        return;
      }

      const result = await invoke<ImageInfo>('convert_image_format', {
        inputPath,
        outputPath: savePath,
      });

      setOutputInfo(result);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to convert image');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Image Format Converter</h2>
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

      {/* Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag and drop an image here, or click "Select Image"
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports: JPG, PNG, WebP, GIF, BMP, TIFF, ICO, SVG
        </p>
      </div>

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
          <div>
            <label className="block mb-2 text-sm font-medium">Convert to:</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SUPPORTED_FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={convertImage}
            disabled={processing}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Converting...' : 'Convert & Save'}
          </button>
        </div>
      )}

      {outputInfo && (
        <div className="border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded p-4 space-y-2">
          <h3 className="font-medium text-green-800 dark:text-green-200">Conversion Successful!</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>{' '}
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

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Supported Conversions:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div>• JPG/JPEG</div>
          <div>• PNG</div>
          <div>• WebP</div>
          <div>• GIF</div>
          <div>• BMP</div>
          <div>• TIFF</div>
          <div>• ICO</div>
        </div>
      </div>
    </div>
  );
}
