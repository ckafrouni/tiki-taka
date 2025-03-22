import { create } from "zustand";
import { Expert } from "~/config/chat-config";
import { Message } from "ai";

export interface UserMessage {
  role: "user";
  content: string;
}

export interface ExpertMessage {
  role: "assistant";
  expertID: number;
  content: string;
}

interface ChatState {
  messages: (UserMessage | ExpertMessage)[];
  formattedMessagesForAISDK: Message[];
  isLoading: boolean;
  input: string;
  experts: Expert[];

  actions: {
    addUserMessage: (content: string) => void;
    addExpertMessage: (expert: Expert, content: string) => void;
    setInput: (input: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setExperts: (experts: Expert[]) => void;
  };
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  formattedMessagesForAISDK: [],
  isLoading: false,
  input: "",
  experts: [],

  actions: {
    addUserMessage: (content: string) =>
      set((state) => ({
        messages: [
          ...state.messages,
          { role: "user", content } satisfies UserMessage,
        ],
        formattedMessagesForAISDK: [
          ...state.formattedMessagesForAISDK,
          {
            id: crypto.randomUUID(),
            role: "user",
            content,
          } satisfies Message,
        ],
      })),
    addExpertMessage: (expert: Expert, content: string) =>
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: "assistant",
            expertID: expert.id,
            content,
          } satisfies ExpertMessage,
        ],
        formattedMessagesForAISDK: [
          ...state.formattedMessagesForAISDK,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content,
          } satisfies Message,
        ],
      })),
    setInput: (input) => set({ input }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setExperts: (experts: Expert[]) => set({ experts }),
  },
}));
