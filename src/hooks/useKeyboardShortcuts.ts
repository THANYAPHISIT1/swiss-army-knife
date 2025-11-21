import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useThemeStore } from '../store/themeStore';

export const useKeyboardShortcuts = () => {
  const { setActiveTab } = useAppStore();
  const { toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd/Ctrl key combinations
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      if (!isCmdOrCtrl) return;

      // Prevent default browser shortcuts
      const handled = true;

      switch (event.key) {
        case '1':
          setActiveTab('json');
          break;
        case '2':
          setActiveTab('base64');
          break;
        case '3':
          setActiveTab('timestamp');
          break;
        case '4':
          setActiveTab('regex');
          break;
        case '5':
          setActiveTab('color');
          break;
        case 'd':
        case 'D':
          toggleTheme();
          break;
        default:
          return; // Don't prevent default if we didn't handle the shortcut
      }

      if (handled) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setActiveTab, toggleTheme]);
};
