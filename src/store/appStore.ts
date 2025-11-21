import { create } from 'zustand';

export type UtilityTab = 'json' | 'base64' | 'timestamp' | 'regex' | 'color';

interface AppStore {
  activeTab: UtilityTab;
  setActiveTab: (tab: UtilityTab) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'json',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
