import { useState } from 'react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
}

export default function JwtDebugger() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState('');

  const base64UrlDecode = (str: string): string => {
    // Replace URL-safe characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

    // Pad with '=' if necessary
    while (base64.length % 4) {
      base64 += '=';
    }

    try {
      return atob(base64);
    } catch (e) {
      throw new Error('Invalid base64 string');
    }
  };

  const decodeJWT = (jwt: string) => {
    try {
      setError('');

      const parts = jwt.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signature] = parts;

      const header = JSON.parse(base64UrlDecode(headerB64));
      const payload = JSON.parse(base64UrlDecode(payloadB64));

      setDecoded({
        header,
        payload,
        signature,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode JWT');
      setDecoded(null);
    }
  };

  const handleTokenChange = (value: string) => {
    setToken(value);
    if (value.trim()) {
      decodeJWT(value);
    } else {
      setDecoded(null);
      setError('');
    }
  };

  const isTokenExpired = (payload: any): boolean => {
    if (payload.exp) {
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await writeText(text);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const clearAll = () => {
    setToken('');
    setDecoded(null);
    setError('');
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">JWT Debugger (Offline)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Decode and inspect JSON Web Tokens securely without sending data to external servers
          </p>
        </div>
        {token && (
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-2 font-medium">JWT Token:</label>
        <textarea
          value={token}
          onChange={(e) => handleTokenChange(e.target.value)}
          placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded resize-none bg-white dark:bg-gray-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {decoded && (
        <div className="flex-1 overflow-auto space-y-4">
          {/* Header */}
          <div className="border border-blue-300 dark:border-blue-700 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-blue-800 dark:text-blue-200">Header</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2))}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto text-xs">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="border border-green-300 dark:border-green-700 rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-green-800 dark:text-green-200">Payload</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2))}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>

            {/* Token Status */}
            {decoded.payload.exp && (
              <div
                className={`p-2 rounded text-sm ${
                  isTokenExpired(decoded.payload)
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                }`}
              >
                <strong>Status:</strong>{' '}
                {isTokenExpired(decoded.payload) ? 'Expired ❌' : 'Valid ✓'}
              </div>
            )}

            <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto text-xs">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>

            {/* Common Claims */}
            <div className="space-y-2 text-sm">
              {decoded.payload.iss && (
                <div>
                  <span className="font-medium">Issuer (iss):</span>{' '}
                  <span className="font-mono">{decoded.payload.iss}</span>
                </div>
              )}
              {decoded.payload.sub && (
                <div>
                  <span className="font-medium">Subject (sub):</span>{' '}
                  <span className="font-mono">{decoded.payload.sub}</span>
                </div>
              )}
              {decoded.payload.aud && (
                <div>
                  <span className="font-medium">Audience (aud):</span>{' '}
                  <span className="font-mono">{decoded.payload.aud}</span>
                </div>
              )}
              {decoded.payload.exp && (
                <div>
                  <span className="font-medium">Expires (exp):</span>{' '}
                  <span className="font-mono">{formatDate(decoded.payload.exp)}</span>
                </div>
              )}
              {decoded.payload.nbf && (
                <div>
                  <span className="font-medium">Not Before (nbf):</span>{' '}
                  <span className="font-mono">{formatDate(decoded.payload.nbf)}</span>
                </div>
              )}
              {decoded.payload.iat && (
                <div>
                  <span className="font-medium">Issued At (iat):</span>{' '}
                  <span className="font-mono">{formatDate(decoded.payload.iat)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="border border-yellow-300 dark:border-yellow-700 rounded p-4 space-y-2">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Signature</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Verify signature using the algorithm specified in the header
            </p>
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto text-xs font-mono break-all">
              {decoded.signature}
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2">About JWT:</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• JWT (JSON Web Token) is a compact, URL-safe means of representing claims</li>
          <li>• Consists of three parts: Header, Payload, and Signature</li>
          <li>• This tool decodes JWTs locally - no data is sent to external servers</li>
          <li>• Always verify the signature before trusting the token</li>
        </ul>
      </div>
    </div>
  );
}
