import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { useThemeStore } from './store/themeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import TabNavigation from './components/TabNavigation';
import ThemeToggle from './components/ThemeToggle';
import JsonFormatter from './components/utilities/JsonFormatter';
import Base64Converter from './components/utilities/Base64Converter';
import TimestampConverter from './components/utilities/TimestampConverter';
import RegexTester from './components/utilities/RegexTester';
import ColorPicker from './components/utilities/ColorPicker';
import ImageResizer from './components/utilities/ImageResizer';
import ImageConverter from './components/utilities/ImageConverter';
import UuidGenerator from './components/utilities/UuidGenerator';
import HashGenerator from './components/utilities/HashGenerator';
import PasswordGenerator from './components/utilities/PasswordGenerator';
import JwtDebugger from './components/utilities/JwtDebugger';
import SmartScratchpad from './components/utilities/SmartScratchpad';

function App() {
  const { activeTab } = useAppStore();
  const { setTheme } = useThemeStore();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setTheme(parsed.state.theme);
      } catch (e) {
        console.error('Failed to parse theme:', e);
      }
    }
  }, [setTheme]);

  const renderUtility = () => {
    switch (activeTab) {
      case 'json':
        return <JsonFormatter />;
      case 'base64':
        return <Base64Converter />;
      case 'timestamp':
        return <TimestampConverter />;
      case 'regex':
        return <RegexTester />;
      case 'color':
        return <ColorPicker />;
      case 'image-resize':
        return <ImageResizer />;
      case 'image-convert':
        return <ImageConverter />;
      case 'uuid':
        return <UuidGenerator />;
      case 'hash':
        return <HashGenerator />;
      case 'password':
        return <PasswordGenerator />;
      case 'jwt':
        return <JwtDebugger />;
      case 'scratchpad':
        return <SmartScratchpad />;
      default:
        return <JsonFormatter />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ThemeToggle />
      <div className="flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold">Dev Utility Belt</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your all-in-one developer toolkit
          </p>
        </div>
        <TabNavigation />
      </div>
      <div className="flex-1 overflow-auto">{renderUtility()}</div>
    </div>
  );
}

export default App;
