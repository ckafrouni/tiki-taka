import { Chat } from "~/components/Chat";
import {
  ANECDOTAL_SYSTEM_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
} from "~/config/chat-config";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Chat customSystemPrompt={ANECDOTAL_SYSTEM_PROMPT} />
    </div>
  );
}
