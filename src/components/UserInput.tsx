"use client";

import { FormEvent } from "react";
import { useChatStore } from "~/stores/chat-store";
import { useExpertsStore } from "~/stores/experts-store";
import { useMutation } from "@tanstack/react-query";
import { Message } from "~/types/message";
import { getExpertOutput } from "~/actions/getExpertOutput";

export default function UserInput() {
  const { input, isLoading, messages, actions } = useChatStore();
  const { experts } = useExpertsStore();

  // Use React Query's useMutation for handling the expert API calls
  const expertMutation = useMutation({
    mutationFn: async (userInput: string) => {
      // Create a new user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userInput,
      };

      // Add the user message to the store
      actions.addMessage(userMessage);

      // Clear displayed messages when a new question is asked
      actions.clearDisplayedMessages();

      // Add the user message to displayed messages
      actions.addDisplayedMessage(userMessage);

      // Process experts sequentially
      const expertResponses: Message[] = [];

      // Process each expert one by one
      for (let i = 0; i < experts.length; i++) {
        const expert = experts[i];

        try {
          // Create a context summary for previous expert responses
          let contextSummary = "";
          if (expertResponses.length > 0) {
            contextSummary = "Previous experts have said:\n\n";
            expertResponses.forEach((resp, idx) => {
              contextSummary += `${
                experts[resp.expertIndex || 0].name ||
                `Expert ${resp.expertIndex || 0 + 1}`
              }: ${resp.content.substring(0, 300)}${
                resp.content.length > 300 ? "..." : ""
              }\n\n`;
            });
          }

          // Create a modified user message that includes previous expert responses
          const modifiedUserMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: contextSummary
              ? `${userInput}\n\n${contextSummary}\n\nPlease respond to my original request, taking into account what the other experts have said.`
              : userInput,
          };

          // For each expert, we'll only send the modified user message
          // This avoids issues with the Anthropic API handling complex conversation formats
          const responseText = await getExpertOutput(
            [modifiedUserMessage],
            expert.prompt
          );

          // Create the assistant message with expert index
          const expertMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: responseText,
            expertIndex: i,
          };

          // Add this expert's response to our collection
          expertResponses.push(expertMessage);

          // Also add it to the store immediately so it's visible in the UI
          actions.addMessage(expertMessage);

          // Add to displayed messages
          actions.addDisplayedMessage(expertMessage);
        } catch (error) {
          console.error(`Error getting response for expert ${i}:`, error);

          // Add an error message for this expert
          const errorMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Error: Could not generate a response for ${
              expert.name || `Expert ${i + 1}`
            }.`,
            expertIndex: i,
          };

          expertResponses.push(errorMessage);
          actions.addMessage(errorMessage);

          // Add error message to displayed messages
          actions.addDisplayedMessage(errorMessage);
        }
      }

      return expertResponses;
    },
    onMutate: () => {
      actions.setIsLoading(true);
    },
    onError: (error) => {
      console.error("Error in chat:", error);
      // Add an error message
      const errorMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
      } as Message;

      actions.addMessage(errorMessage);
      actions.addDisplayedMessage(errorMessage);
    },
    onSettled: () => {
      actions.setIsLoading(false);
    },
  });

  // Function to handle sending a message
  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();

    if (!input.trim() || isLoading) return;

    const currentInput = input;
    actions.setInput(""); // Clear input immediately for better UX

    await expertMutation.mutateAsync(currentInput);
  };

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
