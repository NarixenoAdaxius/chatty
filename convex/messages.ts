import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

// Get messages for a conversation with pagination
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { conversationId, limit = 50, cursor }) => {
    let messagesQuery = ctx.db
      .query("messages")
      .withIndex("by_conversation")
      .filter((q) => q.eq(q.field("conversationId"), conversationId))
      .order("desc");

    if (cursor) {
      messagesQuery = messagesQuery.filter((q) =>
        q.lt(q.field("_creationTime"), parseInt(cursor))
      );
    }

    const messages = await messagesQuery.take(limit);

    // Get reactions for these messages
    const messagesWithReactions = await Promise.all(
      messages.map(async (message) => {
        const reactions = await ctx.db
          .query("messageReactions")
          .withIndex("by_message")
          .filter((q) => q.eq(q.field("messageId"), message._id))
          .collect();

        // Get sender info
        const sender = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("clerkId"), message.senderId))
          .first();

        // Get reply-to message if exists
        let replyToMessage = null;
        if (message.replyToId) {
          replyToMessage = await ctx.db.get(message.replyToId);
        }

        return {
          ...message,
          reactions: reactions.map((r) => ({
            userId: r.userId,
            emoji: r.emoji,
            createdAt: r._creationTime,
          })),
          sender,
          replyTo: replyToMessage,
        };
      })
    );

    const hasMore = messages.length === limit;
    const nextCursor = hasMore
      ? messages[messages.length - 1]._creationTime.toString()
      : null;

    return {
      messages: messagesWithReactions.reverse(), // Return in chronological order
      hasMore,
      nextCursor,
    };
  },
});

// Send a new message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
    type: v.optional(v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("file"),
      v.literal("voice"),
      v.literal("video"),
      v.literal("location"),
      v.literal("system")
    )),
    replyToId: v.optional(v.id("messages")),
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
  },
  handler: async (ctx, args) => {
    // Verify user is a member of the conversation
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), args.conversationId),
          q.eq(q.field("userId"), args.senderId)
        )
      )
      .first();

    if (!membership) {
      throw new Error("User is not a member of this conversation");
    }

    // Create the message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      type: args.type || "text",
      status: "sent",
      replyToId: args.replyToId,
      attachments: args.attachments,
    });

    // Update conversation's last message
    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      lastMessageTime: Date.now(),
    });

    // Remove typing indicator if exists
    const typingIndicator = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), args.conversationId),
          q.eq(q.field("userId"), args.senderId)
        )
      )
      .first();

    if (typingIndicator) {
      await ctx.db.delete(typingIndicator._id);
    }

    return messageId;
  },
});

// Edit a message
export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { messageId, userId, content }) => {
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== userId) {
      throw new Error("Can only edit your own messages");
    }

    // Messages can only be edited within 48 hours
    const fortyEightHours = 48 * 60 * 60 * 1000;
    if (Date.now() - message._creationTime > fortyEightHours) {
      throw new Error("Message is too old to edit");
    }

    await ctx.db.patch(messageId, {
      content,
      editedAt: Date.now(),
    });

    return await ctx.db.get(messageId);
  },
});

// Delete a message
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
  },
  handler: async (ctx, { messageId, userId }) => {
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Check if user can delete (sender or admin)
    let canDelete = message.senderId === userId;

    if (!canDelete) {
      // Check if user is admin of the conversation
      const membership = await ctx.db
        .query("conversationMembers")
        .withIndex("by_conversation_and_user")
        .filter((q) =>
          q.and(
            q.eq(q.field("conversationId"), message.conversationId),
            q.eq(q.field("userId"), userId)
          )
        )
        .first();

      canDelete = membership?.role === "admin";
    }

    if (!canDelete) {
      throw new Error("Cannot delete this message");
    }

    await ctx.db.patch(messageId, {
      deletedAt: Date.now(),
      content: "This message was deleted",
    });

    return { success: true };
  },
});

// Add reaction to message
export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, { messageId, userId, emoji }) => {
    // Check if reaction already exists
    const existingReaction = await ctx.db
      .query("messageReactions")
      .withIndex("by_message_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), messageId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    if (existingReaction) {
      // Update existing reaction
      await ctx.db.patch(existingReaction._id, { emoji });
    } else {
      // Create new reaction
      await ctx.db.insert("messageReactions", {
        messageId,
        userId,
        emoji,
      });
    }

    return { success: true };
  },
});

// Remove reaction from message
export const removeReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
  },
  handler: async (ctx, { messageId, userId }) => {
    const reaction = await ctx.db
      .query("messageReactions")
      .withIndex("by_message_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), messageId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    if (reaction) {
      await ctx.db.delete(reaction._id);
    }

    return { success: true };
  },
});

// Update typing indicator
export const updateTypingIndicator = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
    isTyping: v.boolean(),
  },
  handler: async (ctx, { conversationId, userId, isTyping }) => {
    const existingIndicator = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    if (isTyping) {
      if (existingIndicator) {
        // Update timestamp
        await ctx.db.patch(existingIndicator._id, {
          timestamp: Date.now(),
        });
      } else {
        // Create new indicator
        await ctx.db.insert("typingIndicators", {
          conversationId,
          userId,
          timestamp: Date.now(),
        });
      }
    } else {
      // Remove typing indicator
      if (existingIndicator) {
        await ctx.db.delete(existingIndicator._id);
      }
    }

    return { success: true };
  },
});

// Get typing indicators for conversation
export const getTypingIndicators = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const fiveSecondsAgo = Date.now() - 5000;
    
    const indicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.gt(q.field("timestamp"), fiveSecondsAgo)
        )
      )
      .collect();

    // Get user info for typing users
    const typingUsers = await Promise.all(
      indicators.map(async (indicator) => {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("clerkId"), indicator.userId))
          .first();
        return user;
      })
    );

    return typingUsers.filter(Boolean);
  },
});

// Search messages in conversation
export const searchMessages = query({
  args: {
    conversationId: v.id("conversations"),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { conversationId, searchTerm, limit = 20 }) => {
    if (!searchTerm.trim()) return [];

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation")
      .filter((q) => q.eq(q.field("conversationId"), conversationId))
      .collect();

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return messages
      .filter((message) =>
        message.content.toLowerCase().includes(lowerSearchTerm) &&
        !message.deletedAt
      )
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, limit);
  },
});