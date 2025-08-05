// App Configuration
export const APP_CONFIG = {
  name: "Chatty",
  description: "Modern messaging application",
  version: "1.0.0",
  author: "Chatty Team",
} as const;

// Message Configuration
export const MESSAGE_CONFIG = {
  maxLength: 4000,
  maxAttachments: 10,
  maxFileSize: 25 * 1024 * 1024, // 25MB
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  supportedVideoTypes: ["video/mp4", "video/webm", "video/ogg"],
  supportedAudioTypes: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a"],
  supportedFileTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ],
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  messagesPerPage: 50,
  typingIndicatorTimeout: 3000, // 3 seconds
  onlineStatusTimeout: 300000, // 5 minutes
  messageRetryAttempts: 3,
  messageRetryDelay: 1000, // 1 second
  autoSaveDelay: 500, // 500ms for draft messages
  maxConversationName: 100,
  maxParticipants: 256, // Discord-like group size
} as const;

// UI Configuration
export const UI_CONFIG = {
  sidebarWidth: 320,
  sidebarMinWidth: 280,
  sidebarMaxWidth: 400,
  messageInputMaxHeight: 200,
  avatarSizes: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  },
  animationDuration: 200,
  toastDuration: 4000,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  defaultTheme: "light",
  storageKey: "chatty-theme",
  systemThemeQuery: "(prefers-color-scheme: dark)",
} as const;

// API Configuration
export const API_CONFIG = {
  endpoints: {
    messages: "/api/messages",
    conversations: "/api/conversations",
    users: "/api/users",
    upload: "/api/upload",
    notifications: "/api/notifications",
  },
  retryAttempts: 3,
  retryDelay: 1000,
  requestTimeout: 30000, // 30 seconds
} as const;

// Real-time Configuration
export const REALTIME_CONFIG = {
  reconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatInterval: 30000, // 30 seconds
  maxReconnectDelay: 10000, // 10 seconds
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  bio: {
    maxLength: 500,
  },
  conversationName: {
    minLength: 1,
    maxLength: 100,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: "Network error. Please check your connection.",
  unauthorized: "You are not authorized to perform this action.",
  forbidden: "Access denied.",
  notFound: "The requested resource was not found.",
  serverError: "Internal server error. Please try again later.",
  validationError: "Please check your input and try again.",
  fileUploadError: "Failed to upload file. Please try again.",
  fileSizeError: "File size exceeds the maximum limit.",
  fileTypeError: "File type is not supported.",
  messageTooLong: `Message exceeds ${MESSAGE_CONFIG.maxLength} characters.`,
  conversationNotFound: "Conversation not found.",
  userNotFound: "User not found.",
  messageNotFound: "Message not found.",
  permissionDenied: "You don't have permission to perform this action.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  messageSent: "Message sent successfully",
  messageDeleted: "Message deleted",
  conversationCreated: "Conversation created",
  conversationDeleted: "Conversation deleted",
  profileUpdated: "Profile updated successfully",
  settingsUpdated: "Settings updated successfully",
  fileUploaded: "File uploaded successfully",
  userBlocked: "User blocked",
  userUnblocked: "User unblocked",
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  sendMessage: "Enter",
  sendMessageWithModifier: "Ctrl+Enter", // For multiline support
  newConversation: "Ctrl+N",
  search: "Ctrl+K",
  toggleSidebar: "Ctrl+B",
  editLastMessage: "ArrowUp",
  focusInput: "Tab",
  escapeModal: "Escape",
} as const;

// Emoji Configuration
export const EMOJI_CONFIG = {
  defaultReactions: ["👍", "❤️", "😂", "😮", "😢", "😡"],
  categories: [
    "smileys",
    "people",
    "nature",
    "food",
    "activities",
    "travel",
    "objects",
    "symbols",
    "flags",
  ],
  recentLimit: 20,
  searchLimit: 50,
} as const;

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  permission: {
    default: "default",
    granted: "granted",
    denied: "denied",
  },
  types: {
    message: "message",
    mention: "mention",
    reaction: "reaction",
    system: "system",
  },
  sounds: {
    message: "/sounds/message.mp3",
    mention: "/sounds/mention.mp3",
    notification: "/sounds/notification.mp3",
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  theme: "chatty-theme",
  sidebarWidth: "chatty-sidebar-width",
  draftMessages: "chatty-draft-messages",
  notificationSettings: "chatty-notification-settings",
  recentEmojis: "chatty-recent-emojis",
  conversationPreferences: "chatty-conversation-preferences",
} as const;

// Route Configuration
export const ROUTES = {
  home: "/",
  chat: "/chat",
  signIn: "/sign-in",
  signUp: "/sign-up",
  profile: "/profile",
  settings: "/settings",
  help: "/help",
  privacy: "/privacy",
  terms: "/terms",
} as const;

// Feature Flags
export const FEATURES = {
  voiceMessages: true,
  videoMessages: true,
  screenSharing: false, // Disabled for MVP
  groupCalls: false, // Disabled for MVP
  messageScheduling: false, // Disabled for MVP
  messageEncryption: false, // Disabled for MVP
  customThemes: true,
  fileSharing: true,
  messageSearch: true,
  messageReactions: true,
  messageReplies: true,
  messageForwarding: true,
  messageEditing: true,
  messageDeleting: true,
  typingIndicators: true,
  onlineStatus: true,
  pushNotifications: true,
  desktopNotifications: true,
  soundNotifications: true,
} as const;