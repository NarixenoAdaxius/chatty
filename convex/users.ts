import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .first();
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// Create or update user (called from Clerk webhook)
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        username: args.username,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        username: args.username,
        imageUrl: args.imageUrl,
        isOnline: true,
        lastSeen: Date.now(),
        status: "online",
      });
    }
  },
});

// Update user online status
export const updateOnlineStatus = mutation({
  args: {
    userId: v.id("users"),
    isOnline: v.boolean(),
  },
  handler: async (ctx, { userId, isOnline }) => {
    await ctx.db.patch(userId, {
      isOnline,
      lastSeen: Date.now(),
      status: isOnline ? "online" : "offline",
    });
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("online"),
      v.literal("away"),
      v.literal("busy"),
      v.literal("offline")
    )),
  },
  handler: async (ctx, { userId, ...updates }) => {
    await ctx.db.patch(userId, updates);
    return await ctx.db.get(userId);
  },
});

// Search users
export const searchUsers = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { query, limit = 10 }) => {
    if (!query.trim()) return [];

    const users = await ctx.db.query("users").collect();
    const lowerQuery = query.toLowerCase();

    return users
      .filter((user) => {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
        const email = user.email.toLowerCase();
        const username = (user.username || "").toLowerCase();

        return (
          fullName.includes(lowerQuery) ||
          email.includes(lowerQuery) ||
          username.includes(lowerQuery)
        );
      })
      .slice(0, limit);
  },
});

// Get online users
export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes
    return await ctx.db
      .query("users")
      .withIndex("by_online_status")
      .filter((q) => 
        q.and(
          q.eq(q.field("isOnline"), true),
          q.gt(q.field("lastSeen"), fiveMinutesAgo)
        )
      )
      .collect();
  },
});

// Delete user (called from Clerk webhook)
export const deleteUser = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
      return { success: true };
    }

    return { success: false, error: "User not found" };
  },
});