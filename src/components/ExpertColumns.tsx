"use client";

import { useExpertsStore } from "~/stores/experts-store";
import { useChatStore } from "~/stores/chat-store";
import { Expert } from "~/config/chat-config";
import { Message } from "~/types/message";

interface ExpertResponseProps {
  expert: Expert;
  index: number;
  latestUserMessage: string | null;
}

const ExpertResponse = ({
  expert,
  index,
  latestUserMessage,
}: ExpertResponseProps) => {
  const { displayedMessages } = useChatStore();

  // Find the latest response from this expert
  const expertResponses = displayedMessages.filter(
    (msg) => msg.role === "assistant" && msg.expertIndex === index
  ) as Message[];

  const latestResponse =
    expertResponses.length > 0
      ? expertResponses[expertResponses.length - 1].content
      : "";

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-white shadow-sm">
      <div className="font-bold text-lg mb-2 pb-2 border-b">
        {expert.name || `Expert ${index + 1}`}
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
  const { experts } = useExpertsStore();
  const { displayedMessages } = useChatStore();

  // Find the latest user message
  const userMessages = displayedMessages.filter((msg) => msg.role === "user");
  const latestUserMessage =
    userMessages.length > 0
      ? userMessages[userMessages.length - 1].content
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 flex-1 overflow-hidden">
      {experts.map((expert, index) => (
        <ExpertResponse
          key={index}
          expert={expert}
          index={index}
          latestUserMessage={latestUserMessage}
        />
      ))}
    </div>
  );
}
