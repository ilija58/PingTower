import { create } from 'zustand';
import { Service } from '../types';
import { fetchServiceById } from '../services/serviceService';

interface ServiceState {
  service: Service | null;
  isLoading: boolean;
  error: string | null;
  fetchService: (id: string) => Promise<void>;
  clearService: () => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  // --- STATE ---
  service: null,
  isLoading: true,
  error: null,

  // --- ACTIONS ---
  fetchService: async (id) => {
    set({ isLoading: true, error: null, service: null });
    try {
      const service = await fetchServiceById(id);
      set({ service, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearService: () => {
    set({ service: null, isLoading: false, error: null });
  },
}));
