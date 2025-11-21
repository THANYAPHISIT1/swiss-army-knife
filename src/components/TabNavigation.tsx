import { useAppStore, UtilityTab } from '../store/appStore';

interface Category {
  name: string;
  label: string;
  utilities: { id: UtilityTab; label: string; icon: string }[];
}

const categories: Category[] = [
  {
    name: 'data',
    label: 'Data & Formatting',
    utilities: [
      { id: 'json', label: 'JSON', icon: '{}' },
      { id: 'yaml', label: 'YAML', icon: '📄' },
      { id: 'base64', label: 'Base64', icon: '64' },
      { id: 'timestamp', label: 'Timestamp', icon: '🕐' },
      { id: 'regex', label: 'Regex', icon: '/.*/' },
      { id: 'sql', label: 'SQL', icon: '🗄️' },
      { id: 'diff', label: 'Diff', icon: '⚖️' },
      { id: 'px-rem', label: 'PX/REM', icon: '📏' },
      { id: 'cron', label: 'Crontab', icon: '⏰' },
      { id: 'token', label: 'Tokens', icon: '🔢' },
    ],
  },
  {
    name: 'image',
    label: 'Image Tools',
    utilities: [
      { id: 'image-resize', label: 'Resize', icon: '📐' },
      { id: 'image-convert', label: 'Convert', icon: '🔄' },
    ],
  },
  {
    name: 'color',
    label: 'Color',
    utilities: [{ id: 'color', label: 'Color Picker', icon: '🎨' }],
  },
  {
    name: 'security',
    label: 'Security & Generators',
    utilities: [
      { id: 'uuid', label: 'UUID', icon: '🆔' },
      { id: 'hash', label: 'Hash', icon: '#️⃣' },
      { id: 'password', label: 'Password', icon: '🔐' },
      { id: 'jwt', label: 'JWT', icon: '🎫' },
    ],
  },
  {
    name: 'utils',
    label: 'Utilities',
    utilities: [{ id: 'scratchpad', label: 'Scratchpad', icon: '📝' }],
  },
];

export default function TabNavigation() {
  const { activeTab, setActiveTab, activeCategory, setActiveCategory } = useAppStore();

  const currentCategory = categories.find((cat) => cat.name === activeCategory) || categories[0];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      {/* Category Tabs */}
      <div className="border-b border-gray-100 dark:border-gray-800 px-4">
        <nav className="flex space-x-1">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setActiveCategory(category.name);
                setActiveTab(category.utilities[0].id);
              }}
              className={`
                px-3 py-2 text-xs font-medium transition-colors rounded-t
                ${
                  activeCategory === category.name
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Utility Tabs */}
      <nav className="flex space-x-2 px-4 overflow-x-auto">
        {currentCategory.utilities.map((util) => (
          <button
            key={util.id}
            onClick={() => setActiveTab(util.id)}
            className={`
              px-4 py-3 font-medium text-sm transition-colors relative whitespace-nowrap
              ${
                activeTab === util.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{util.icon}</span>
              {util.label}
            </span>
            {activeTab === util.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
