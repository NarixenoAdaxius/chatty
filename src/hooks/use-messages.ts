"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"

export function useMessages(conversationId: Id<"conversations"> | null) {
  const messagesData = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId } : "skip"
  )

  return {
    messages: messagesData?.messages || [],
    hasMore: messagesData?.hasMore || false,
    nextCursor: messagesData?.nextCursor,
    isLoading: messagesData === undefined && conversationId !== null,
  }
}

export function useSendMessage() {
  const sendMessage = useMutation(api.messages.sendMessage)

  return {
    sendMessage: async (data: {
      conversationId: Id<"conversations">
      senderId: string
      content: string
      type?: "text" | "image" | "file" | "voice" | "video" | "location" | "system"
      replyToId?: Id<"messages">
      attachments?: Array<{
        id: string
        name: string
        url: string
        type: string
        size: number
        width?: number
        height?: number
        duration?: number
      }>
    }) => {
      try {
        const messageId = await sendMessage(data)
        return { success: true, messageId }
      } catch (error) {
        console.error('Failed to send message:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useEditMessage() {
  const editMessage = useMutation(api.messages.editMessage)

  return {
    editMessage: async (data: {
      messageId: Id<"messages">
      userId: string
      content: string
    }) => {
      try {
        const updatedMessage = await editMessage(data)
        return { success: true, message: updatedMessage }
      } catch (error) {
        console.error('Failed to edit message:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useDeleteMessage() {
  const deleteMessage = useMutation(api.messages.deleteMessage)

  return {
    deleteMessage: async (data: {
      messageId: Id<"messages">
      userId: string
    }) => {
      try {
        await deleteMessage(data)
        return { success: true }
      } catch (error) {
        console.error('Failed to delete message:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useMessageReactions() {
  const addReaction = useMutation(api.messages.addReaction)
  const removeReaction = useMutation(api.messages.removeReaction)

  return {
    addReaction: async (data: {
      messageId: Id<"messages">
      userId: string
      emoji: string
    }) => {
      try {
        await addReaction(data)
        return { success: true }
      } catch (error) {
        console.error('Failed to add reaction:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
    removeReaction: async (data: {
      messageId: Id<"messages">
      userId: string
    }) => {
      try {
        await removeReaction(data)
        return { success: true }
      } catch (error) {
        console.error('Failed to remove reaction:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useTypingIndicator() {
  const updateTypingIndicator = useMutation(api.messages.updateTypingIndicator)

  return {
    setTyping: async (data: {
      conversationId: Id<"conversations">
      userId: string
      isTyping: boolean
    }) => {
      try {
        await updateTypingIndicator(data)
        return { success: true }
      } catch (error) {
        console.error('Failed to update typing indicator:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useTypingUsers(conversationId: Id<"conversations"> | null) {
  const typingUsers = useQuery(
    api.messages.getTypingIndicators,
    conversationId ? { conversationId } : "skip"
  )

  return {
    typingUsers: typingUsers || [],
    isLoading: typingUsers === undefined && conversationId !== null,
  }
}