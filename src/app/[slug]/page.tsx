"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ExpertColumns } from "~/components/ExpertColumns";
import UserInput from "~/app/beta/[slug]/components/UserInput";
import { getExpertPrompt } from "~/config/chat-config";
import { cognitiveDiversity } from "~/config/persona.json";
import { useChatStore } from "~/stores/chat-store";

export default function Home() {
  const params = useParams();
  const task_name = params.slug as keyof typeof cognitiveDiversity;

  const { context, task_prompt, actions } = useChatStore();

  // First effect to set up the initial values
  useEffect(() => {
    actions.setContext(cognitiveDiversity[task_name]["task_placeholder"]);
    actions.setTaskPrompt(cognitiveDiversity[task_name]["task_prompt"]);
  }, [task_name, actions]);

  // Second effect to set up experts AFTER task_prompt and context are set
  useEffect(() => {
    // Only set experts if both task_prompt and context are properly initialized
    if (task_prompt && context) {
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
          color: "#FF0000",
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
          color: "#00FF00",
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
          color: "#0000FF",
        },
      ]);
    }
  }, [task_prompt, context, actions, task_name]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Expert Panel</h1>
      </header>

      <textarea
        value={context}
        onChange={(e) => {
          actions.setContext(e.target.value);
        }}
      ></textarea>

      <main className="flex-1 overflow-y-auto p-4">
        <ExpertColumns />
      </main>

      <footer className="border-t">
        <UserInput />
      </footer>
    </div>
  );
}
