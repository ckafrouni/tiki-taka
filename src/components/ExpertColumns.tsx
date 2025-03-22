"use client";

import { useChatStore } from "~/stores/chat-store";
import { Expert } from "~/config/chat-config";

interface ExpertResponseProps {
  expert: Expert;
  latestUserMessage: string | null;
}

const ExpertResponse = ({ expert, latestUserMessage }: ExpertResponseProps) => {
  // Use a selector to get only the latest response for this expert
  const latestResponse = useChatStore((state) => {
    return (
      [...state.messages]
        .reverse()
        .find((msg) => msg.role === "assistant" && msg.expertID === expert.id)
        ?.content || ""
    );
  });

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-white shadow-sm">
      <div className="font-bold text-lg mb-2 pb-2 border-b">
        {expert.name || `Expert ${expert.id}`}
      </div>

      {latestUserMessage && (
        <div className="text-sm text-gray-500 mb-2 italic">
          Responding to: "{latestUserMessage}"
        </div>
      )}

      <div className="flex-1 overflow-y-auto whitespace-pre-wrap">
        {latestResponse}
      </div>
    </div>
  );
};

export function ExpertColumns() {
  // Use selectors to get only what we need from the store
  const experts = useChatStore((state) => state.experts);

  // Get the latest user message directly with a selector
  const latestUserMessage = useChatStore((state) => {
    return (
      [...state.messages].reverse().find((msg) => msg.role === "user")
        ?.content || null
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 flex-1 overflow-hidden">
      {experts.map((expert) => (
        <ExpertResponse
          key={expert.id}
          expert={expert}
          latestUserMessage={latestUserMessage}
        />
      ))}
    </div>
  );
}
