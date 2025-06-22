import { create } from 'zustand'

import type { StoreState } from './types';

export const useCustomStore = create<StoreState>((set) => ({
  isLoading: false,
  startLoading: () => set(() => ({ isLoading: true })),
  stopLoading: () => set(() => ({ isLoading: false })),
}));
