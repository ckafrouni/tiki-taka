"use client";

import { FormEvent, useCallback } from "react";
import { useChatStore } from "~/stores/chat-store";
import { useMutation } from "@tanstack/react-query";
import { getExpertOutput } from "~/actions/getExpertOutput";

export default function UserInput() {
  const { input, isLoading, actions, formattedMessagesForAISDK, experts } =
    useChatStore();

  const expertMutation = useMutation({
    mutationFn: async (userInput: string) => {
      actions.addUserMessage(userInput);
      console.log(
        "messages:",
        JSON.stringify(formattedMessagesForAISDK, null, 2)
      );

      for (let i = 0; i < experts.length; i++) {
        const expert = experts[i];

        try {
          const responseText = await getExpertOutput(
            formattedMessagesForAISDK,
            expert
          );
          actions.addExpertMessage(expert, responseText);
        } catch (error) {
          console.error(`Error getting response for expert ${i}:`, error);
          actions.addExpertMessage(
            expert,
            `Error: Could not generate a response for ${
              expert.name || `Expert ${i + 1}`
            }.`
          );
        }
      }
    },
    onMutate: () => {
      actions.setIsLoading(true);
    },
    onError: (error) => {
      console.error("Error in chat:", error);
    },
    onSettled: () => {
      actions.setIsLoading(false);
    },
  });

  const sendMessage = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!input.trim() || isLoading) return;
      const currentInput = input;
      actions.setInput(""); // Clear input immediately for better UX
      await expertMutation.mutateAsync(currentInput);
    },
    [input, isLoading, actions, expertMutation]
  );

  return (
    <form onSubmit={sendMessage} className="p-4 border-t">
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => actions.setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </form>
  );
}
