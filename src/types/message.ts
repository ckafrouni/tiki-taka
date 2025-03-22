import { Message as AIMessage } from "ai";

export interface Message extends AIMessage {
  expertIndex?: number;
}
