import {
  CoreMessage,
  CoreUserMessage,
  CoreAssistantMessage,
  CoreSystemMessage,
  CoreToolMessage,
} from "ai";

export interface Agent {
  name?: string;
  model?: string;
  instruction?: string;
  tools?: Tool[];
  tool_choice?: string;
}

export interface Tool {
  name: string; // func name
  args: any;
}

export interface AgentResponse {
  messages: CoreMessage[];
  agent?: Agent;
  variables?: Record<string, any>;  // context variables, shared between agents
}
