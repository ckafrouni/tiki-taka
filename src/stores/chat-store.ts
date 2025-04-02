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
  context: string;
  task_prompt: string;
  generatingExperts: number[];

  actions: {
    addUserMessage: (content: string) => void;
    addExpertMessage: (
      expert: Expert,
      content: string,
      isStreaming?: boolean
    ) => void;
    setInput: (input: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setExperts: (experts: Expert[]) => void;
    setContext: (context: string) => void;
    setTaskPrompt: (task_prompt: string) => void;
    setExpertGenerating: (expertId: number, isGenerating: boolean) => void;
  };
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  input: "",
  experts: [],
  context: "",
  task_prompt: "",
  generatingExperts: [],

  actions: {
    addUserMessage: (content: string) =>
      set((state) => ({
        messages: [
          ...state.messages,
          { role: "user", content } satisfies UserMessage,
        ],
      })),
    addExpertMessage: (expert: Expert, content: string, isStreaming = false) =>
      set((state) => {
        const lastMessage = state.messages[state.messages.length - 1];
        const isLastMessageFromSameExpert =
          lastMessage &&
          lastMessage.role === "assistant" &&
          lastMessage.expertID === expert.id;

        if (isStreaming && isLastMessageFromSameExpert) {
          const updatedMessages = [...state.messages];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            expertID: expert.id,
            expertName: expert.name,
            content,
          } satisfies ExpertMessage;

          return { messages: updatedMessages };
        } else {
          return {
            messages: [
              ...state.messages,
              {
                role: "assistant",
                expertID: expert.id,
                expertName: expert.name,
                content,
              } satisfies ExpertMessage,
            ],
            ...(isStreaming
              ? {}
              : {
                  generatingExperts: state.generatingExperts.filter(
                    (id) => id !== expert.id
                  ),
                }),
          };
        }
      }),
    setInput: (input) => set({ input }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setExperts: (experts: Expert[]) => set({ experts }),
    setContext: (context: string) => set({ context }),
    setTaskPrompt: (task_prompt: string) => set({ task_prompt }),
    setExpertGenerating: (expertId: number, isGenerating: boolean) =>
      set((state) => ({
        generatingExperts: isGenerating
          ? [...state.generatingExperts, expertId]
          : state.generatingExperts.filter((id) => id !== expertId),
      })),
  },
}));

export const getLatestUserMessage = (state: ChatState) =>
  [...state.messages].reverse().find((msg) => msg.role === "user")?.content;

export const getLatestExpertMessage = (state: ChatState, expertId: number) =>
  [...state.messages].reverse().find(
    (msg) => msg.role === "assistant" && (msg as ExpertMessage).expertID === expertId
  )?.content || "";
