import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

// Get conversations for a user
export const getConversationsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get conversation memberships for the user
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const conversations = await Promise.all(
      memberships.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) return null;

        // Get last message if exists
        let lastMessage = null;
        if (conversation.lastMessageId) {
          lastMessage = await ctx.db.get(conversation.lastMessageId);
        }

        // Get unread count
        const unreadCount = await ctx.db
          .query("messages")
          .withIndex("by_conversation")
          .filter((q) =>
            q.and(
              q.eq(q.field("conversationId"), conversation._id),
              membership.lastReadAt
                ? q.gt(q.field("_creationTime"), membership.lastReadAt)
                : q.gt(q.field("_creationTime"), 0)
            )
          )
          .collect();

        return {
          ...conversation,
          lastMessage,
          unreadCount: unreadCount.length,
          membership,
        };
      })
    );

    return conversations
      .filter((conv) => conv !== null)
      .sort((a, b) => b!.lastMessageTime - a!.lastMessageTime);
  },
});

// Create a new conversation
export const createConversation = mutation({
  args: {
    createdBy: v.string(),
    participants: v.array(v.string()),
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // For 1-on-1 chats, check if conversation already exists
    if (!args.isGroup && args.participants.length === 2) {
      const [user1, user2] = args.participants.sort();
      
      // Find existing conversation between these two users
      const existingConversations = await ctx.db
        .query("conversations")
        .filter((q) => q.eq(q.field("isGroup"), false))
        .collect();

      for (const conv of existingConversations) {
        const sortedParticipants = conv.participants.sort();
        if (
          sortedParticipants.length === 2 &&
          sortedParticipants[0] === user1 &&
          sortedParticipants[1] === user2
        ) {
          return conv._id;
        }
      }
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      name: args.name,
      isGroup: args.isGroup,
      participants: args.participants,
      lastMessageTime: Date.now(),
      createdBy: args.createdBy,
      imageUrl: args.imageUrl,
    });

    // Add all participants as members
    await Promise.all(
      args.participants.map((userId) =>
        ctx.db.insert("conversationMembers", {
          conversationId,
          userId,
          role: userId === args.createdBy ? "admin" : "member",
          joinedAt: Date.now(),
        })
      )
    );

    return conversationId;
  },
});

// Get conversation by ID with members
export const getConversationById = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return null;

    // Get members
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation")
      .filter((q) => q.eq(q.field("conversationId"), conversationId))
      .collect();

    // Get user details for members
    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("clerkId"), membership.userId))
          .first();
        return { ...membership, user };
      })
    );

    return { ...conversation, members };
  },
});

// Add participants to conversation
export const addParticipants = mutation({
  args: {
    conversationId: v.id("conversations"),
    participants: v.array(v.string()),
    addedBy: v.string(),
  },
  handler: async (ctx, { conversationId, participants, addedBy }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new Error("Can only add participants to group conversations");
    }

    // Check if addedBy is an admin
    const addedByMembership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("userId"), addedBy)
        )
      )
      .first();

    if (!addedByMembership || addedByMembership.role !== "admin") {
      throw new Error("Only admins can add participants");
    }

    // Add new participants
    const newParticipants = [...conversation.participants];
    const membersToAdd = [];

    for (const userId of participants) {
      if (!conversation.participants.includes(userId)) {
        newParticipants.push(userId);
        membersToAdd.push({
          conversationId,
          userId,
          role: "member" as const,
          joinedAt: Date.now(),
        });
      }
    }

    // Update conversation participants
    await ctx.db.patch(conversationId, {
      participants: newParticipants,
    });

    // Add memberships
    await Promise.all(
      membersToAdd.map((member) => ctx.db.insert("conversationMembers", member))
    );

    return { success: true };
  },
});

// Remove participant from conversation
export const removeParticipant = mutation({
  args: {
    conversationId: v.id("conversations"),
    participantId: v.string(),
    removedBy: v.string(),
  },
  handler: async (ctx, { conversationId, participantId, removedBy }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new Error("Can only remove participants from group conversations");
    }

    // Check permissions (admin or self-removal)
    if (participantId !== removedBy) {
      const removedByMembership = await ctx.db
        .query("conversationMembers")
        .withIndex("by_conversation_and_user")
        .filter((q) =>
          q.and(
            q.eq(q.field("conversationId"), conversationId),
            q.eq(q.field("userId"), removedBy)
          )
        )
        .first();

      if (!removedByMembership || removedByMembership.role !== "admin") {
        throw new Error("Only admins can remove other participants");
      }
    }

    // Remove from participants array
    const newParticipants = conversation.participants.filter(
      (id) => id !== participantId
    );

    await ctx.db.patch(conversationId, {
      participants: newParticipants,
    });

    // Remove membership
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("userId"), participantId)
        )
      )
      .first();

    if (membership) {
      await ctx.db.delete(membership._id);
    }

    return { success: true };
  },
});

// Update conversation (name, image, etc.)
export const updateConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    updatedBy: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, { conversationId, updatedBy, ...updates }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Check if user is a member
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("userId"), updatedBy)
        )
      )
      .first();

    if (!membership) {
      throw new Error("User is not a member of this conversation");
    }

    // For group chats, only admins can update
    if (conversation.isGroup && membership.role !== "admin") {
      throw new Error("Only admins can update group conversations");
    }

    await ctx.db.patch(conversationId, updates);
    return await ctx.db.get(conversationId);
  },
});

// Mark conversation as read
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
    lastMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, { conversationId, userId, lastMessageId }) => {
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    if (membership) {
      await ctx.db.patch(membership._id, {
        lastReadMessageId: lastMessageId,
        lastReadAt: Date.now(),
      });
    }
  },
});

// Archive/unarchive conversation
export const toggleArchiveConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
  },
  handler: async (ctx, { conversationId, userId }) => {
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_and_user")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    if (membership) {
      const conversation = await ctx.db.get(conversationId);
      await ctx.db.patch(conversationId, {
        isArchived: !conversation?.isArchived,
      });
    }
  },
});