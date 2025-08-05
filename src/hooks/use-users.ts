"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"

export function useCurrentUser() {
  const { user: clerkUser } = useUser()
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  )

  return {
    user: convexUser,
    clerkUser,
    isLoading: convexUser === undefined && clerkUser !== undefined,
  }
}

export function useUpdateProfile() {
  const updateProfile = useMutation(api.users.updateProfile)

  return {
    updateProfile: async (data: {
      userId: Id<"users">
      firstName?: string
      lastName?: string
      username?: string
      bio?: string
      status?: "online" | "away" | "busy" | "offline"
    }) => {
      try {
        const updatedUser = await updateProfile(data)
        return { success: true, user: updatedUser }
      } catch (error) {
        console.error('Failed to update profile:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useOnlineStatus() {
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus)

  return {
    setOnlineStatus: async (data: {
      userId: Id<"users">
      isOnline: boolean
    }) => {
      try {
        await updateOnlineStatus(data)
        return { success: true }
      } catch (error) {
        console.error('Failed to update online status:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
  }
}

export function useSearchUsers() {
  const [searchQuery, setSearchQuery] = useState("")
  const searchResults = useQuery(
    api.users.searchUsers,
    searchQuery.length >= 2 ? { query: searchQuery, limit: 10 } : "skip"
  )

  return {
    searchQuery,
    setSearchQuery,
    searchResults: searchResults || [],
    isLoading: searchResults === undefined && searchQuery.length >= 2,
  }
}

export function useOnlineUsers() {
  const onlineUsers = useQuery(api.users.getOnlineUsers)

  return {
    onlineUsers: onlineUsers || [],
    isLoading: onlineUsers === undefined,
  }
}