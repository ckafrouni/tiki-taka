"use client";

import { useChatStore } from "~/stores/chat-store";
import { Expert } from "~/config/chat-config";
import { useEffect, useState } from "react";

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

  // Get all experts to find colors for @mentions
  const allExperts = useChatStore((state) => state.experts);

  // Function to get expert color by name
  const getExpertColorByName = (name: string) => {
    // Remove the @ symbol
    const expertName = name.substring(1);
    
    // Handle @All case
    if (expertName.toLowerCase() === "all") {
      return "#000000"; // Black color for @All
    }
    
    // Find the expert by name
    const foundExpert = allExperts.find(
      (e) => e.name.toLowerCase() === expertName.toLowerCase()
    );
    
    // Return the found expert's color or a default color
    return foundExpert?.color || "#000000";
  };

  // Check if this expert is currently generating
  const isGenerating = useChatStore((state) =>
    state.generatingExperts.includes(expert.id)
  );

  // Animation dots state for generating indicator
  const [animationDots, setAnimationDots] = useState(".");

  // Update animation dots when generating
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setAnimationDots((prev) => {
        if (prev === "...") return ".";
        if (prev === "..") return "...";
        if (prev === ".") return "..";
        return ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <div
      className={`border-8 border-solid flex flex-col h-full rounded-lg p-4 shadow-sm ${
        isGenerating ? "animate-pulse" : ""
      }`}
      style={{
        borderColor: expert.color,
        backgroundColor: `${expert.color}10`,
      }}
    >
      <div className="font-bold text-lg mb-2 pb-2 border-b flex justify-between items-center">
        <span>{expert.name || `Expert ${expert.id}`}</span>
        {isGenerating && (
          <span className="text-blue-500 text-sm font-normal">
            Generating{animationDots}
          </span>
        )}
      </div>

      {latestUserMessage && (
        <div className="text-sm text-gray-500 mb-2 italic">
          Responding to: "{latestUserMessage}"
        </div>
      )}
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap">
        {latestResponse?.split(/(@\w+)/).map((part, i) =>
          part.startsWith("@") ? (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full mx-0.5 inline-block font-medium text-white"
              style={{ 
                backgroundColor: getExpertColorByName(part)
              }}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
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
