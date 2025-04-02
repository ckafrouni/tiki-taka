"use client";

import { useMutation } from "@tanstack/react-query";
import { LucideLoader, LucideSend, LucideSkipForward } from "lucide-react";
import { FormEvent, useCallback } from "react";
import { getExpertOutput } from "~/actions/getExpertOutput";
import { useChatStore } from "~/stores/chat-store";

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

          // Get the stream from getExpertOutput
          const responseStream = await getExpertOutput(messages, expert);
          
          // Create a temporary variable to accumulate the full response
          let fullResponse = "";
          
          // Create a reader from the stream
          const reader = responseStream.getReader();
          
          try {
            // Process the stream
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                break;
              }
              
              // Accumulate the response
              fullResponse += value;
              
              // Update the message with the current accumulated text
              // This creates the streaming effect in the UI
              actions.addExpertMessage(expert, fullResponse, true);
            }
            
            // Final update with complete text
            console.log(
              `Received complete response from expert ${expert.name} (${fullResponse.length} chars)`
            );
            actions.addExpertMessage(expert, fullResponse);
          } catch (error) {
            console.error(`Error processing stream for expert ${expert.name}:`, error);
            actions.addExpertMessage(expert, `Error: Could not process the response for ${expert.name}.`);
          } finally {
            // Expert is no longer generating
            actions.setExpertGenerating(expert.id, false);
          }
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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit form on Enter without Shift key
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!isLoading) {
          sendMessage(event as unknown as FormEvent);
        }
      }
    },
    [sendMessage, isLoading]
  );

  return (
    <form onSubmit={sendMessage}>
      <div className="outline-8 outline-neutral-900 absolute flex bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] rounded-tl-xl rounded-tr-xl bg-neutral-100 text-neutral-900">
        <textarea
          value={input}
          onChange={(e) => actions.setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What are you thinking?"
          className="w-full h-full bg-neutral-900/5 rounded-tl-xl rounded-tr-xl mt-2 ml-2 p-2 resize-none text-neutral-900"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-16 h-full flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-neutral-300 active:bg-neutral-400">
            {isLoading ? (
              <LucideLoader className="w-6 h-6 animate-spin text-neutral-700" />
            ) : input && input.length > 0 ? (
              <LucideSend className="w-6 h-6 text-neutral-700" />
            ) : (
              <LucideSkipForward className="w-6 h-6 text-neutral-700" />
            )}
          </div>
        </button>
      </div>
    </form>
  );
}
