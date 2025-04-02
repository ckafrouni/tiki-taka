"use server";

import { Message } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { Expert } from "~/config/chat-config";
import { UserMessage, ExpertMessage } from "~/stores/chat-store";

const CHAT_MODEL_CONFIG = {
  model: anthropic("claude-3-5-sonnet-latest"),
  maxTokens: 1024,
};

export async function getExpertOutput(
  messages: (UserMessage | ExpertMessage)[],
  expert: Expert
): Promise<ReadableStream<string>> {
  const formattedMessages = messages.map(
    (msg) =>
      ({
        id: crypto.randomUUID(),
        role: msg.role === "user" ? "user" : "user",
        content: `${msg.role === "assistant" ? msg.expertName : "Human"}: ${
          msg.content
        }`,
      } satisfies Message)
  );

  if (!formattedMessages || formattedMessages.length === 0) {
    return new ReadableStream<string>();
  }

  try {
    const result = streamText({
      model: CHAT_MODEL_CONFIG.model,
      messages: formattedMessages,
      maxTokens: CHAT_MODEL_CONFIG.maxTokens,
      system: expert.prompt,
      onError: (error) => {
        console.error("Error streaming from Anthropic API:", error);
      },
    });

    return result.textStream;
  } catch (error) {
    console.error("Error setting up Anthropic API stream:", error);

    const errorStream = new ReadableStream<string>({
      start(controller) {
        const errorMessage =
          error instanceof Error
            ? `Error: ${error.message}`
            : "There was an error generating a response. Please try again.";
        controller.enqueue(errorMessage);
        controller.close();
      },
    });

    return errorStream;
  }
}
