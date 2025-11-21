import { useAppStore, UtilityTab } from '../store/appStore';

const tabs: { id: UtilityTab; label: string; icon: string }[] = [
  { id: 'json', label: 'JSON', icon: '{}' },
  { id: 'base64', label: 'Base64', icon: '64' },
  { id: 'timestamp', label: 'Timestamp', icon: '🕐' },
  { id: 'regex', label: 'Regex', icon: '/.*/' },
  { id: 'color', label: 'Color', icon: '🎨' },
];

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-2 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 font-medium text-sm transition-colors relative
              ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
