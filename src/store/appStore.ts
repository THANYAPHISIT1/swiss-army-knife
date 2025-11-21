import { create } from 'zustand';

export type UtilityTab =
  | 'json'
  | 'base64'
  | 'timestamp'
  | 'regex'
  | 'yaml'
  | 'sql'
  | 'diff'
  | 'px-rem'
  | 'color'
  | 'image-resize'
  | 'image-convert'
  | 'uuid'
  | 'hash'
  | 'password'
  | 'jwt'
  | 'cron'
  | 'token'
  | 'scratchpad';

interface AppStore {
  activeTab: UtilityTab;
  setActiveTab: (tab: UtilityTab) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'json',
  setActiveTab: (tab) => set({ activeTab: tab }),
  activeCategory: 'data',
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
