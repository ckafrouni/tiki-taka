import { create } from "zustand";
import { Expert } from "~/config/chat-config";

export interface UserMessage {
  role: "user";
  content: string;
}

export interface ExpertMessage {
  role: "assistant";
  expertID: number;
  expertName: string;
  content: string;
}

interface ChatState {
  messages: (UserMessage | ExpertMessage)[];
  isLoading: boolean;
  input: string;
  experts: Expert[];
  generatingExperts: number[];

  actions: {
    addUserMessage: (content: string) => void;
    addExpertMessage: (expert: Expert, content: string) => void;
    setInput: (input: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setExperts: (experts: Expert[]) => void;
    setExpertGenerating: (expertId: number, isGenerating: boolean) => void;
  };
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  input: "",
  experts: [],
  generatingExperts: [],

  actions: {
    addUserMessage: (content: string) =>
      set((state) => ({
        messages: [
          ...state.messages,
          { role: "user", content } satisfies UserMessage,
        ],
      })),
    addExpertMessage: (expert: Expert, content: string) =>
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: "assistant",
            expertID: expert.id,
            expertName: expert.name,
            content,
          } satisfies ExpertMessage,
        ],
        generatingExperts: state.generatingExperts.filter(
          (id) => id !== expert.id
        ),
      })),
    setInput: (input) => set({ input }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setExperts: (experts: Expert[]) => set({ experts }),
    setExpertGenerating: (expertId: number, isGenerating: boolean) =>
      set((state) => ({
        generatingExperts: isGenerating
          ? [...state.generatingExperts, expertId]
          : state.generatingExperts.filter((id) => id !== expertId),
      })),
  },
}));
