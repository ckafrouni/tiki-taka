"use server";

import { Message } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { Expert } from "~/config/chat-config";
import { UserMessage, ExpertMessage } from "~/stores/chat-store";

const CHAT_MODEL_CONFIG = {
  model: anthropic("claude-3-5-sonnet-latest"),
  maxTokens: 1024,
};

export async function getExpertOutput(
  messages: (UserMessage | ExpertMessage)[],
  expert: Expert
): Promise<string> {
  // Convert messages to AI SDK format
  console.log(messages)
  const formattedMessages = messages.map(
    (msg) =>
      ({
        id: crypto.randomUUID(),
        role: msg.role === "user" ? "user" : "user",
        content: `${msg.role === "assistant" ? msg.expertName : "Human"}: ${msg.content}`,
      } satisfies Message)
  );

  // Log all messages used for inference
  // console.log(`--- Inference for Expert ${expert.id} (${expert.name}) ---`);
  // console.log(`Total messages: ${messages.length}`);
  // console.log("Formatted messages:");
  formattedMessages.forEach((msg, index) => {
    console.log(
      `[${index}] ${msg.role}: ${msg.content.substring(0, 50)}${
        msg.content.length > 50 ? "..." : ""
      }`
    );
  });
  console.log(`System prompt: ${expert.prompt.substring(0, 100)}...`);
  console.log("-------------------------------------------");

  // Ensure we have messages to process
  if (!formattedMessages || formattedMessages.length === 0) {
    console.error("No messages provided to getExpertOutput");
    return "No messages provided to generate a response.";
  }

  try {
    // Make sure ANTHROPIC_API_KEY is set in your environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
    }

    const response = await generateText({
      model: CHAT_MODEL_CONFIG.model,
      messages: formattedMessages,
      maxTokens: CHAT_MODEL_CONFIG.maxTokens,
      system: expert.prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Anthropic API:", error);

    // More detailed error message
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }

    return "There was an error generating a response. Please try again.";
  }
}
