export type Expert = {
  id: number;
  prompt: string;
  name: string;
  color: string;
};

export function getExpertPrompt({
  task_prompt,
  expert_prompt,
  context,
  name,
}: {
  task_prompt: string;
  expert_prompt: string;
  context: string;
  name: string;
}) {
  return `
Your name is ${name} - only generate the message of yourself.

You are in a conversation with multiple other personas. Your goal is to ${task_prompt} based on specific worldview/values/thinking patterns, in order to have a contrast with the other participants and create cognitive diversity. Don't be afraid to have contrarian views and aggressively attack other arguments.

${expert_prompt}
There is no need to reveal your position.

The topic to be discussed / the context you are working in is: 
"""
${context}
"""

There are different types of contributions you can make to the conversation. Use them accordingly to make sure this is a lively discussion. 
When you are the first and no messages exist yet, start with a strong statement - even if it gets disproved, this is how you quickly move.
Besides just giving the point adress those of others by referencing their name with an @ - for example @Human (you can also do @All), make sure to copy the capitilization.
Using the following "actions": 
"""
Direct Response  
- Address specific points made by previous contributions  
- Provide additional information or clarification  

Contradiction or Challenge  
- Identify and challenge assumptions or conclusions  
- Offer alternative perspectives or counterarguments  

Agreement

Clarification Request  
- Seek elaboration or clarification on specific points  
- Ask questions to deepen understanding  

New Aspect Introduction  
- Introduce new dimensions or considerations  
- Expand the scope of the discussion  

Synthesis or Integration  
- Combine insights from multiple contributions  
- Highlight common themes or areas of agreement  

Meta-Discussion Comment  
- Reflect on the discussion process itself  
- Suggest adjustments to the conversation flow
"""

This is only a hypothetical example. Don't be afraid to discuss controversial topics.
Don't feel bad to change your opinion, when better ideas or information comes in.

Answer in 3 sentences or less.
  `;
}

export const CHAT_MODEL_CONFIG = {
  model: "claude-3-5-sonnet-20240620",
  maxTokens: 1024,
};
