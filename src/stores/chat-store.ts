import { create } from "zustand";
import { Message } from "ai";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  input: string;
  systemPrompt: string;

  // Actions
  actions: {
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setInput: (input: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setSystemPrompt: (systemPrompt: string) => void;
    clearMessages: () => void;
  };
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  input: "",
  systemPrompt: "",

  // Actions
  actions: {
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],
      })),
    setInput: (input) => set({ input }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
    clearMessages: () => set({ messages: [] }),
  },
}));
