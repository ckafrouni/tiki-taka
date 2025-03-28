"use client";

import UserInput from "./components/UserInput";
import Sidebar from "./components/Sidebar";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getExpertPrompt } from "~/config/chat-config";
import { cognitiveDiversity } from "~/config/persona.json";
import { useChatStore } from "~/stores/chat-store";
import { ExpertColumns } from "./components/ExpertColumns";

export default function BetaPage() {
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
          color: "#FFA95D",
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
          color: "#64B2DF",
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
          color: "#FF79D0",
        },
      ]);
    }
  }, [task_prompt, context, actions, task_name]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-neutral-900 text-white overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4">
        <ExpertColumns />
      </main>
      <Sidebar />
      <UserInput />
    </div>
  );
}
