"use client";

import { useRef, useEffect } from "react";
import { useChat } from "~/hooks/use-chat";

interface ChatProps {
  customSystemPrompt?: string;
}

export function Chat({ customSystemPrompt }: ChatProps = {}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, isLoading, actions, sendMessage } = useChat();

  // Set custom system prompt if provided
  useEffect(() => {
    if (customSystemPrompt) {
      actions.setSystemPrompt(customSystemPrompt);
    }
  }, [customSystemPrompt, actions.setSystemPrompt]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <h2 className="text-2xl font-bold mb-2">Claude 3.7 Sonnet Chat</h2>
            <p>Start a conversation with Claude!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg max-w-[80%] ${
              message.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === "user" ? "You" : "Claude"}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => actions.setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
