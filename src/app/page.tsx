"use client";

import { useEffect, useState } from "react";
import { ExpertColumns } from "~/components/ExpertColumns";
import UserInput from "~/components/UserInput";
import { getExpertPrompt } from "~/config/chat-config";
import { cognitiveDiversity } from "~/config/persona.json";
import { useChatStore } from "~/stores/chat-store";

export default function Home() {
  const [context, setContext] = useState("");
  const [task_prompt, setTaskPrompt] = useState("");
  const { actions } = useChatStore();

  const task_name = "ethicalMoralDiscourse";
  const initial_scratchpad_text = "how to improve womans rights";

  useEffect(() => {
    setTaskPrompt(cognitiveDiversity[task_name]["task_prompt"]);
    setContext(initial_scratchpad_text);
    actions.setExperts([
      {
        id: 1,
        name: cognitiveDiversity[task_name]["experts"][0]["name"],
        prompt: getExpertPrompt({
          task_prompt,
          expert_prompt:
            cognitiveDiversity[task_name]["experts"][0]["cognition"],
          context,
          name: cognitiveDiversity[task_name]["experts"][0]["name"],
        }),
      },
      {
        id: 2,
        name: cognitiveDiversity[task_name]["experts"][1]["name"],
        prompt: getExpertPrompt({
          task_prompt,
          expert_prompt:
            cognitiveDiversity[task_name]["experts"][1]["cognition"],
          context,
          name: cognitiveDiversity[task_name]["experts"][1]["name"],
        }),
      },
      {
        id: 3,
        name: cognitiveDiversity[task_name]["experts"][2]["name"],
        prompt: getExpertPrompt({
          task_prompt,
          expert_prompt:
            cognitiveDiversity[task_name]["experts"][2]["cognition"],
          context,
          name: cognitiveDiversity[task_name]["experts"][2]["name"],
        }),
      },
    ]);
  }, [task_prompt, context, actions]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Expert Panel</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <ExpertColumns />
      </main>

      <footer className="border-t">
        <UserInput />
      </footer>
    </div>
  );
}
