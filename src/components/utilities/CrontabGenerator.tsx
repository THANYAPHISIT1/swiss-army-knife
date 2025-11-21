import { useState, useEffect } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function CrontabGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setCronExpression(expression);
    setDescription(describeCron(expression));
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const describeCron = (expression: string): string => {
    const parts = expression.split(' ');
    const [min, hr, dom, mon, dow] = parts;

    const descriptions: string[] = [];

    // Minute
    if (min === '*') descriptions.push('every minute');
    else if (min.includes('/')) descriptions.push(`every ${min.split('/')[1]} minutes`);
    else if (min.includes(',')) descriptions.push(`at minutes ${min}`);
    else descriptions.push(`at minute ${min}`);

    // Hour
    if (hr === '*') descriptions.push('of every hour');
    else if (hr.includes('/')) descriptions.push(`every ${hr.split('/')[1]} hours`);
    else if (hr.includes(',')) descriptions.push(`at hours ${hr}`);
    else descriptions.push(`at ${hr}:00`);

    // Day of month
    if (dom !== '*') {
      if (dom.includes('/')) descriptions.push(`every ${dom.split('/')[1]} days`);
      else if (dom.includes(',')) descriptions.push(`on days ${dom}`);
      else descriptions.push(`on day ${dom}`);
    }

    // Month
    if (mon !== '*') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (mon.includes(',')) {
        const monthNames = mon.split(',').map(m => months[parseInt(m) - 1]).join(', ');
        descriptions.push(`in ${monthNames}`);
      } else {
        descriptions.push(`in ${months[parseInt(mon) - 1]}`);
      }
    }

    // Day of week
    if (dow !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (dow.includes(',')) {
        const dayNames = dow.split(',').map(d => days[parseInt(d)]).join(', ');
        descriptions.push(`on ${dayNames}`);
      } else {
        descriptions.push(`on ${days[parseInt(dow)]}`);
      }
    }

    return descriptions.join(' ');
  };

  const copyExpression = async () => {
    try {
      await writeText(cronExpression);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const presets = [
    { label: 'Every minute', value: ['*', '*', '*', '*', '*'] },
    { label: 'Every 5 minutes', value: ['*/5', '*', '*', '*', '*'] },
    { label: 'Every 15 minutes', value: ['*/15', '*', '*', '*', '*'] },
    { label: 'Every hour', value: ['0', '*', '*', '*', '*'] },
    { label: 'Every day at midnight', value: ['0', '0', '*', '*', '*'] },
    { label: 'Every day at noon', value: ['0', '12', '*', '*', '*'] },
    { label: 'Every Monday at 9am', value: ['0', '9', '*', '*', '1'] },
    { label: 'Every Sunday at midnight', value: ['0', '0', '*', '*', '0'] },
    { label: 'First day of month', value: ['0', '0', '1', '*', '*'] },
    { label: 'Every weekday at 8am', value: ['0', '8', '*', '*', '1-5'] },
  ];

  const loadPreset = (preset: string[]) => {
    setMinute(preset[0]);
    setHour(preset[1]);
    setDayOfMonth(preset[2]);
    setMonth(preset[3]);
    setDayOfWeek(preset[4]);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Crontab Expression Generator</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Create cron schedule expressions visually
        </p>
      </div>

      {/* Cron Expression Display */}
      <div className="border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Cron Expression:</span>
          <button
            onClick={copyExpression}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="font-mono text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
          {cronExpression}
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {description}
        </div>
      </div>

      {/* Cron Fields */}
      <div className="grid grid-cols-5 gap-3">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Minute (0-59)
          </label>
          <input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="*"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Hour (0-23)
          </label>
          <input
            type="text"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            placeholder="*"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Day (1-31)
          </label>
          <input
            type="text"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            placeholder="*"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Month (1-12)
          </label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="*"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Day of Week (0-6)
          </label>
          <input
            type="text"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            placeholder="*"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Presets */}
      <div>
        <h3 className="font-medium mb-2">Common Presets:</h3>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => loadPreset(preset.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-left"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Cron Expression Syntax:</h3>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div className="grid grid-cols-2 gap-2">
            <div><strong>*</strong> - Any value</div>
            <div><strong>5</strong> - Specific value</div>
            <div><strong>1-5</strong> - Range of values</div>
            <div><strong>1,3,5</strong> - Multiple values</div>
            <div><strong>*/5</strong> - Every 5 units</div>
            <div><strong>1-5/2</strong> - Every 2nd in range</div>
          </div>
          <p className="mt-2"><strong>Day of Week:</strong> 0 = Sunday, 1 = Monday, ..., 6 = Saturday</p>
        </div>
      </div>
    </div>
  );
}
