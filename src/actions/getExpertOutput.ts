"use server";

import { Message } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { Expert } from "~/config/chat-config";

const CHAT_MODEL_CONFIG = {
  model: anthropic("claude-3-5-sonnet-latest"),
  maxTokens: 1024,
};

export async function getExpertOutput(
  messages: Message[],
  expert: Expert
): Promise<string> {
  // Ensure we have messages to process
  if (!messages || messages.length === 0) {
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
      messages,
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
