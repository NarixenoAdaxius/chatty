import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - stores user profile information
  users: defineTable({
    clerkId: v.string(), // Clerk user ID for authentication
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isOnline: v.boolean(),
    lastSeen: v.number(),
    status: v.optional(v.union(
      v.literal("online"),
      v.literal("away"), 
      v.literal("busy"),
      v.literal("offline")
    )),
    bio: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_online_status", ["isOnline", "lastSeen"]),

  // Conversations table - stores chat conversations (1-on-1 and groups)
  conversations: defineTable({
    name: v.optional(v.string()), // For group chats
    isGroup: v.boolean(),
    participants: v.array(v.string()), // Array of user IDs
    lastMessageId: v.optional(v.id("messages")),
    lastMessageTime: v.number(),
    createdBy: v.string(), // User ID who created the conversation
    imageUrl: v.optional(v.string()), // For group chat avatars
    isArchived: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
  })
    .index("by_participants", ["participants"])
    .index("by_last_message", ["lastMessageTime"])
    .index("by_creator", ["createdBy"]),

  // Messages table - stores all messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(), // User ID
    content: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("file"),
      v.literal("voice"),
      v.literal("video"),
      v.literal("location"),
      v.literal("system")
    ),
    status: v.union(
      v.literal("sending"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("read"),
      v.literal("failed")
    ),
    replyToId: v.optional(v.id("messages")), // Message being replied to
    attachments: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      url: v.string(),
      type: v.string(),
      size: v.number(),
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      duration: v.optional(v.number()),
    }))),
    editedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    forwardedFromId: v.optional(v.id("messages")), // Original message if forwarded
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"])
    .index("by_reply_to", ["replyToId"])
    .index("by_status", ["status"]),

  // Message Reactions table - stores reactions to messages
  messageReactions: defineTable({
    messageId: v.id("messages"),
    userId: v.string(),
    emoji: v.string(),
  })
    .index("by_message", ["messageId"])
    .index("by_user", ["userId"])
    .index("by_message_and_user", ["messageId", "userId"]),

  // Typing Indicators table - stores who is currently typing
  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    timestamp: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // Conversation Members table - stores membership details
  conversationMembers: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
    lastReadMessageId: v.optional(v.id("messages")),
    lastReadAt: v.optional(v.number()),
    isMuted: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"])
    .index("by_conversation_and_user", ["conversationId", "userId"]),

  // User Contacts table - stores user connections/friends
  userContacts: defineTable({
    userId: v.string(),
    contactId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("blocked")
    ),
    requestedBy: v.string(), // Who initiated the contact request
    requestedAt: v.number(),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_contact", ["contactId"])
    .index("by_user_and_contact", ["userId", "contactId"])
    .index("by_status", ["status"]),

  // Notification Settings table - stores user notification preferences
  notificationSettings: defineTable({
    userId: v.string(),
    muteAll: v.boolean(),
    mutedConversations: v.array(v.id("conversations")),
    soundEnabled: v.boolean(),
    desktopEnabled: v.boolean(),
    emailEnabled: v.boolean(),
  })
    .index("by_user", ["userId"]),

  // File Uploads table - stores file metadata
  fileUploads: defineTable({
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedBy: v.string(), // User ID
    storageId: v.string(), // Convex file storage ID
    url: v.string(),
    conversationId: v.optional(v.id("conversations")),
    messageId: v.optional(v.id("messages")),
  })
    .index("by_uploader", ["uploadedBy"])
    .index("by_conversation", ["conversationId"])
    .index("by_message", ["messageId"])
    .index("by_storage_id", ["storageId"]),
});