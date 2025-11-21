import { useState } from 'react';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  const [convertedTimestamp, setConvertedTimestamp] = useState('');

  const timestampToDate = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        throw new Error('Invalid timestamp');
      }
      // Handle both seconds and milliseconds
      const date = ts > 10000000000 ? new Date(ts) : fromUnixTime(ts);
      setConvertedDate(format(date, 'yyyy-MM-dd HH:mm:ss'));
    } catch (e) {
      setConvertedDate('Invalid timestamp');
    }
  };

  const dateToTimestamp = () => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      const ts = getUnixTime(date);
      setConvertedTimestamp(ts.toString());
    } catch (e) {
      setConvertedTimestamp('Invalid date');
    }
  };

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
    setConvertedDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
  };

  const copyDate = async () => {
    try {
      await writeText(convertedDate);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const copyTimestamp = async () => {
    try {
      await writeText(convertedTimestamp);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Unix Timestamp Converter</h2>
        <button
          onClick={getCurrentTimestamp}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Current Timestamp
        </button>
      </div>

      {/* Timestamp to Date */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-3">
        <h3 className="font-medium">Timestamp to Date</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="Enter Unix timestamp (seconds or milliseconds)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={timestampToDate}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Convert
          </button>
        </div>
        {convertedDate && (
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono">
              {convertedDate}
            </div>
            <button
              onClick={copyDate}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {/* Date to Timestamp */}
      <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-3">
        <h3 className="font-medium">Date to Timestamp</h3>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={dateToTimestamp}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Convert
          </button>
        </div>
        {convertedTimestamp && (
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono">
              {convertedTimestamp}
            </div>
            <button
              onClick={copyTimestamp}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Unix timestamps can be in seconds (10 digits) or milliseconds (13 digits).</p>
        <p className="mt-1">Current timestamp: {Math.floor(Date.now() / 1000)}</p>
      </div>
    </div>
  );
}
