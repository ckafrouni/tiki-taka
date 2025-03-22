"use server";

import { Anthropic } from "@anthropic-ai/sdk";
import { Message } from "~/types/message";
import { CHAT_MODEL_CONFIG } from "~/config/chat-config";

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function getExpertOutput(
  messages: Message[],
  systemPrompt: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  try {
    // Convert the messages to Anthropic's format
    const formattedMessages = messages.map((message) => ({
      role:
        message.role === "user" ? ("user" as const) : ("assistant" as const),
      content: message.content,
    }));

    console.log(
      "Formatted messages:",
      JSON.stringify(formattedMessages, null, 2)
    );
    console.log("System prompt:", systemPrompt);

    // Create a non-streaming response
    const response = await anthropic.messages.create({
      model: CHAT_MODEL_CONFIG.model,
      messages: formattedMessages,
      max_tokens: CHAT_MODEL_CONFIG.maxTokens,
      stream: false,
      system: systemPrompt,
    });

    console.log("API response:", JSON.stringify(response, null, 2));

    // Safely access the content
    if (
      response.content &&
      response.content.length > 0 &&
      response.content[0] &&
      response.content[0].type === "text"
    ) {
      return response.content[0].text;
    }

    // Fallback if the response structure is different
    return "I couldn't generate a proper response at this time.";
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    return "There was an error generating a response. Please try again.";
  }
}
