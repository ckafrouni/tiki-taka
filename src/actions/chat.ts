"use server";

import { Anthropic } from "@anthropic-ai/sdk";
import { Message } from "ai";
import { DEFAULT_SYSTEM_PROMPT, CHAT_MODEL_CONFIG } from "~/config/chat-config";

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function chatWithClaude(
  messages: Message[], 
  systemPrompt: string = DEFAULT_SYSTEM_PROMPT
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  // Convert the messages to Anthropic's format
  const formattedMessages = messages.map((message) => ({
    role: message.role === "user" ? ("user" as const) : ("assistant" as const),
    content: message.content,
  }));

  // Create a non-streaming response
  const response = await anthropic.messages.create({
    model: CHAT_MODEL_CONFIG.model,
    messages: formattedMessages,
    max_tokens: CHAT_MODEL_CONFIG.maxTokens,
    stream: false,
    system: systemPrompt,
  });

  // Return the complete response text
  // Access the content correctly based on the Anthropic API response structure
  if (response.content[0].type === "text") {
    return response.content[0].text;
  }

  return "I couldn't generate a response at this time.";
}
