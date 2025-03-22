import { create } from "zustand";
import { Expert } from "~/config/chat-config";

interface ExpertsStore {
  experts: Expert[];
  actions: {
    setExperts: (experts: Expert[]) => void;
  };
}

export const useExpertsStore = create<ExpertsStore>((set) => ({
  experts: [],
  actions: {
    setExperts: (experts: Expert[]) => set({ experts }),
  },
}));
