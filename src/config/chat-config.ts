export type Expert = {
  prompt: string;
  name: string;
};

export function getExpertPrompt({
  task_prompt,
  expert_prompt,
  context,
}: {
  task_prompt: string;
  expert_prompt: string;
  context: string;
}) {
  return `
  The setting is a discourse. Your goal is to ${task_prompt} based on a strict worldview/values/thinking patterns, in order to have a contrast with the other participants and create cognitive diversity. Don't be afraid to have contrarian views and aggressively attack other arguments.

  ${expert_prompt}

  The topic to be discussed is: ${context}
  `;
}

// export const DEFAULT_SYSTEM_PROMPT = `You are a helpful, friendly, and knowledgeable AI assistant named Claude, created by Anthropic.
// Your goal is to provide accurate, informative, and helpful responses while being conversational and engaging.
// You should be honest about what you know and don't know. If you're unsure about something, it's better to acknowledge that than to provide potentially incorrect information.
// You should respect the user's privacy and avoid asking for personal information.
// Keep your responses concise and to the point, but provide enough detail to be helpful.`;

export const CHAT_MODEL_CONFIG = {
  model: "claude-3-5-sonnet-20240620",
  maxTokens: 1024,
};
