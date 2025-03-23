"use client";

import { FormEvent, useCallback } from "react";
import { useChatStore } from "~/stores/chat-store";
import { useMutation } from "@tanstack/react-query";
import { getExpertOutput } from "~/actions/getExpertOutput";

export default function UserInput() {
  const { input, isLoading, actions, experts } = useChatStore();

  const expertMutation = useMutation({
    mutationFn: async (userInput: string) => {
      if (userInput && userInput.length > 0) {
        actions.addUserMessage(userInput);
      }

      console.log("Starting expert responses for user input:", userInput);
      console.log(`Processing responses for ${experts.length} experts`);

      for (let i = 0; i < experts.length; i++) {
        const { messages } = useChatStore.getState();

        const expert = experts[i];
        console.log(
          `Processing expert ${i + 1}/${experts.length}: ${expert.name}`
        );

        try {
          // Set this expert as generating
          actions.setExpertGenerating(expert.id, true);

          const responseText = await getExpertOutput(messages, expert); // 0
          console.log(
            `Received response from expert ${expert.name} (${responseText.length} chars)`
          );
          actions.addExpertMessage(expert, responseText);

          // Expert is no longer generating (this is also handled in addExpertMessage but adding here for clarity)
          actions.setExpertGenerating(expert.id, false);
        } catch (error) {
          console.error(`Error getting response for expert ${i}:`, error);
          actions.addExpertMessage(
            expert,
            `Error: Could not generate a response for ${
              expert.name || `Expert ${i + 1}`
            }.`
          );
          // Make sure to set expert as not generating even if there's an error
          actions.setExpertGenerating(expert.id, false);
        }
      }

      console.log("All expert responses completed");
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
    // here we handle the state of the input and calling the mutation function
    // since empty messages (even with a system prompt) don't work, we simply append a "next" if the user is clicking "next" on an empty field
    async (event: FormEvent) => {
      event.preventDefault();
      if (isLoading) return;
      let currentInput = input;

      if (!currentInput || currentInput == "") {
        currentInput = "-";
      }

      actions.setInput("");
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
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : input && input.length > 0 ? "Send" : "Next"}
        </button>
      </div>
    </form>
  );
}
