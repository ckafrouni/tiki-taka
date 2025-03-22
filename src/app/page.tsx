"use client";

import { useEffect, useState } from "react";
import { ExpertColumns } from "~/components/ExpertColumns";
import UserInput from "~/components/UserInput";
import { getExpertPrompt } from "~/config/chat-config";
import { cognitiveDiversity } from "~/config/persona.json";
import { useExpertsStore } from "~/stores/experts-store";

export default function Home() {
  const [context, setContext] = useState("");
  const [task_prompt, setTaskPrompt] = useState("");
  const { actions } = useExpertsStore();

  useEffect(() => {
    setTaskPrompt("We want to brainstorm about new ways to brainstorm");
    setContext(`
      # Scratchpad
      
      We want to brainstorm about new ways to brainstorm

      ## Already Discussed
      
      - Listening to kids
      `);
    actions.setExperts([
      {
        name: "Divergent Thinker: Dave",
        prompt: getExpertPrompt({
          task_prompt,
          expert_prompt: cognitiveDiversity["brainstorming"][0],
          context,
        }),
      },
      {
        name: "Practical Implementer: Jane",
        prompt: getExpertPrompt({
          task_prompt,
          expert_prompt: cognitiveDiversity["brainstorming"][1],
          context,
        }),
      },
      {
        name: "Critical Evaluator: Mark",
        prompt: getExpertPrompt({
          task_prompt,
          expert_prompt: cognitiveDiversity["brainstorming"][2],
          context,
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
