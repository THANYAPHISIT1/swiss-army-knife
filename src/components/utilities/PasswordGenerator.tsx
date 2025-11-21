import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [error, setError] = useState('');
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);

  const generatePassword = async () => {
    try {
      setError('');
      const options = {
        length,
        include_uppercase: includeUppercase,
        include_lowercase: includeLowercase,
        include_numbers: includeNumbers,
        include_symbols: includeSymbols,
      };

      const newPassword = await invoke<string>('generate_password', { options });
      setPassword(newPassword);

      // Add to history (keep last 5)
      setPasswordHistory((prev) => [newPassword, ...prev].slice(0, 5));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate password');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await writeText(text);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;

    if (pwd.length >= 12) score += 2;
    else if (pwd.length >= 8) score += 1;

    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 2;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 6) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = password ? calculateStrength(password) : null;

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Password Generator</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Generate secure random passwords
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {password && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 px-3 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-lg"
            />
            <button
              onClick={() => copyToClipboard(password)}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors whitespace-nowrap"
            >
              Copy
            </button>
          </div>

          {strength && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Strength:</span>
                <span className="font-medium">{strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${strength.color} transition-all`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Length: {length}</label>
            <span className="text-sm text-gray-600 dark:text-gray-400">{length} characters</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>32</span>
            <span>64</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Character Types:</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Uppercase Letters (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Lowercase Letters (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Symbols (!@#$%^&*)</span>
            </label>
          </div>
        </div>

        <button
          onClick={generatePassword}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
        >
          Generate Password
        </button>
      </div>

      {passwordHistory.length > 0 && (
        <div className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2">
          <h3 className="font-medium text-sm">Recent Passwords:</h3>
          <div className="space-y-1">
            {passwordHistory.map((pwd, index) => (
              <div
                key={index}
                onClick={() => copyToClipboard(pwd)}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {pwd}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">Password Tips:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Use at least 12 characters for better security</li>
          <li>• Include a mix of character types</li>
          <li>• Don't reuse passwords across different accounts</li>
          <li>• Consider using a password manager</li>
        </ul>
      </div>
    </div>
  );
}
