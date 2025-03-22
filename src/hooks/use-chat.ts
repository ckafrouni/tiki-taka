import { useMutation } from "@tanstack/react-query";
import { Message } from "ai";
import { chatWithClaude } from "~/actions/chat";
import { useChatStore } from "~/stores/chat-store";
import { DEFAULT_SYSTEM_PROMPT } from "~/config/chat-config";

export function useChat() {
  const { messages, input, isLoading, systemPrompt, actions } = useChatStore();

  // Initialize system prompt if not set
  if (!systemPrompt) {
    actions.setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
  }

  // Use React Query's useMutation for handling the chat API call
  const chatMutation = useMutation({
    mutationFn: async (userInput: string) => {
      // Create a new user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userInput,
      };

      // Add the user message to the store
      actions.addMessage(userMessage);

      // Call the API with all messages
      const responseText = await chatWithClaude(
        [...messages, userMessage],
        systemPrompt
      );

      // Create and return the assistant message
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseText,
      } as Message;
    },
    onMutate: () => {
      actions.setIsLoading(true);
    },
    onSuccess: (assistantMessage) => {
      // Add the assistant message to the store
      actions.addMessage(assistantMessage);
    },
    onError: (error) => {
      console.error("Error in chat:", error);
      // Add an error message
      actions.addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
      } as Message);
    },
    onSettled: () => {
      actions.setIsLoading(false);
    },
  });

  // Function to handle sending a message
  const sendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!input.trim() || isLoading) return;

    const currentInput = input;
    actions.setInput(""); // Clear input immediately for better UX

    await chatMutation.mutateAsync(currentInput);
  };

  return {
    messages,
    input,
    isLoading,
    systemPrompt,
    actions,
    sendMessage,
  };
}
