export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  imageUrl?: string;
  isOnline: boolean;
  lastSeen: number;
  status?: "online" | "away" | "busy" | "offline";
  bio?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Conversation {
  _id: string;
  _creationTime: number;
  name?: string; // For group chats
  isGroup: boolean;
  participants: string[]; // User IDs
  lastMessage?: Message;
  lastMessageTime: number;
  createdBy: string;
  imageUrl?: string; // For group chat avatars
  unreadCount?: number;
  isArchived?: boolean;
  isPinned?: boolean;
}

export interface Message {
  _id: string;
  _creationTime: number;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  replyTo?: string; // Message ID being replied to
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  editedAt?: number;
  deletedAt?: number;
  forwardedFrom?: string; // Original message ID if forwarded
}

export type MessageType = 
  | "text" 
  | "image" 
  | "file" 
  | "voice" 
  | "video" 
  | "location" 
  | "system";

export type MessageStatus = 
  | "sending" 
  | "sent" 
  | "delivered" 
  | "read" 
  | "failed";

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // For voice/video
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: number;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  timestamp: number;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: number;
}

export interface ChatState {
  selectedConversationId: string | null;
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>; // conversationId -> userIds
  onlineUsers: Set<string>;
  unreadCounts: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationSettings {
  userId: string;
  muteAll: boolean;
  mutedConversations: string[];
  soundEnabled: boolean;
  desktopEnabled: boolean;
  emailEnabled: boolean;
}

export interface Theme {
  name: string;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  cursor?: string;
  total?: number;
}

// Form types
export interface MessageFormData {
  content: string;
  attachments?: File[];
  replyTo?: string;
}

export interface UserProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  status: "online" | "away" | "busy" | "offline";
}

export interface ConversationFormData {
  name: string;
  participants: string[];
  imageUrl?: string;
}

// Event types for real-time updates
export interface ChatEvent {
  type: ChatEventType;
  data: unknown;
  timestamp: number;
}

export type ChatEventType =
  | "message_sent"
  | "message_received"
  | "message_read"
  | "user_typing"
  | "user_stopped_typing"
  | "user_online"
  | "user_offline"
  | "conversation_created"
  | "conversation_updated"
  | "reaction_added"
  | "reaction_removed";

// Search types
export interface SearchResult {
  type: "user" | "conversation" | "message";
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  data: User | Conversation | Message;
}

export interface SearchFilters {
  type?: "all" | "users" | "conversations" | "messages";
  dateRange?: {
    from: Date;
    to: Date;
  };
  conversationId?: string;
}