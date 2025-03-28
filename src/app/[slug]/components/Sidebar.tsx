"use client";

import { LucideChevronRight, LucideMessageCircle } from "lucide-react";
import { useWorkspaceStore } from "~/stores/workspace-store";
import { useChatStore } from "~/stores/chat-store";
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { currentTab } = useWorkspaceStore();

  return (
    <>
      {/* Fullscreen overlay background */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out z-[5] ${
          currentTab ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => useWorkspaceStore.getState().actions.closeTab()}
      />

      <div
        className={`fixed left-0 top-0 z-10 h-full transition-all duration-300 ease-in-out`}
      >
        <SidebarContent
          className={`${currentTab ? "w-[600px]" : "w-0"}`}
          currentTab={currentTab}
        />
        <SidebarNav currentTab={currentTab} />
      </div>
    </>
  );
}

function SidebarButton({
  tab,
  currentTab,
  onClick,
}: {
  tab: "context" | "messages";
  currentTab: "context" | "messages" | null;
  onClick: () => void;
}) {
  return (
    <button
      className={`w-[64px] h-[64px] flex items-center justify-center cursor-pointer rounded-tr-xl rounded-br-xl ${
        currentTab === tab ? "bg-neutral-100" : "bg-neutral-500"
      }`}
      onClick={onClick}
    >
      {tab === "context" ? (
        <LucideChevronRight className="w-6 h-6 text-neutral-900" />
      ) : (
        <LucideMessageCircle className="w-6 h-6 text-neutral-900" />
      )}
    </button>
  );
}

function SidebarNav({
  currentTab,
}: {
  currentTab: "context" | "messages" | null;
}) {
  const { actions } = useWorkspaceStore();
  return (
    <div
      className={`fixed top-[100px] flex flex-col gap-4 transition-all duration-300 ease-in-out ${
        currentTab ? "left-[600px]" : "left-0"
      }`}
    >
      <SidebarButton
        tab="context"
        currentTab={currentTab}
        onClick={() => {
          if (currentTab === "context") {
            actions.closeTab();
          } else {
            actions.setCurrentTab("context");
          }
        }}
      />
      <SidebarButton
        tab="messages"
        currentTab={currentTab}
        onClick={() => {
          if (currentTab === "messages") {
            actions.closeTab();
          } else {
            actions.setCurrentTab("messages");
          }
        }}
      />
    </div>
  );
}

function SidebarContent({
  currentTab,
  className,
}: {
  currentTab: "context" | "messages" | null;
  className?: string;
}) {
  // Use state to control content visibility with a delay
  const [showContent, setShowContent] = useState(false);
  
  // Update showContent based on currentTab with appropriate delays
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (currentTab) {
      // Show content after sidebar is fully open (300ms is the sidebar transition duration)
      timer = setTimeout(() => setShowContent(true), 300);
    } else {
      // Hide content immediately when closing starts
      setShowContent(false);
    }
    
    return () => clearTimeout(timer);
  }, [currentTab]);
  
  return (
    <div
      className={`absolute top-0 left-0 z-10 rounded-tr-xl rounded-br-xl h-full bg-neutral-100 text-black overflow-hidden transition-all duration-300 ease-in-out ${className}`}
    >
      <div 
        className={`h-full transition-opacity duration-300 ease-in-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {currentTab && (currentTab === "context" ? <ContextTab /> : <ChatHistoryTab />)}
      </div>
    </div>
  );
}

function ContextTab() {
  const { context, actions: chatActions } = useChatStore();
  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Context</h2>
      <div className="flex-1">
        <p className="mb-2 text-sm text-neutral-600">
          Modify the context that will be used for generating responses:
        </p>
        <textarea
          value={context}
          onChange={(e) => chatActions.setContext(e.target.value)}
          placeholder="Enter context information here..."
          className="w-full h-1/2 flex-1 p-3 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500"
        />
      </div>
    </div>
  );
}

function ChatHistoryTab() {
  const { messages } = useChatStore();
  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <p className="text-sm text-neutral-600">
              {message.role === "assistant" ? message.expertName : "You"}
            </p>
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
