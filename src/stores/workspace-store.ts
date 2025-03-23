import { create } from "zustand";

type WorkspaceStore = {
  currentTab: "context" | "messages" | null;
  actions: {
    setCurrentTab: (tab: "context" | "messages") => void;
    closeTab: () => void;
  };
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentTab: null,
  actions: {
    setCurrentTab: (tab: "context" | "messages") =>
      set({
        currentTab: tab,
      }),
    closeTab: () => set({ currentTab: null }),
  },
}));
