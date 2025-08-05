"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"

export function useConversations(userId: string) {
  const conversations = useQuery(api.conversations.getConversationsForUser, {
    userId,
  })

  return {
    conversations: conversations || [],
    isLoading: conversations === undefined,
  }
}

export function useCreateConversation() {
  const createConversation = useMutation(api.conversations.createConversation)

  return {
    createConversation: async (data: {
      createdBy: string
      participants: string[]
      name?: string
      isGroup: boolean
      imageUrl?: string
    }) => {
      try {
        const conversationId = await createConversation(data)
        return { success: true, conversationId }
      } catch (error) {
        console.error('Failed to create conversation:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useConversation(conversationId: Id<"conversations"> | null) {
  const conversation = useQuery(
    api.conversations.getConversationById,
    conversationId ? { conversationId } : "skip"
  )

  return {
    conversation,
    isLoading: conversation === undefined && conversationId !== null,
  }
}

export function useMarkAsRead() {
  const markAsRead = useMutation(api.conversations.markAsRead)

  return {
    markAsRead: async (data: {
      conversationId: Id<"conversations">
      userId: string
      lastMessageId?: Id<"messages">
    }) => {
      try {
        await markAsRead(data)
        return { success: true }
      } catch (error) {
        console.error('Failed to mark as read:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}