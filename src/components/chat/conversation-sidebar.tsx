"use client"

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

type UserResource = NonNullable<ReturnType<typeof useUser>['user']>
import { Search, Plus, Menu, Settings, MessageSquare, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface ConversationSidebarProps {
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  onShowProfile: () => void
  user: UserResource
}

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    unreadCount: 2,
    isOnline: true,
    avatar: null,
    isGroup: false,
  },
  {
    id: '2',
    name: 'Team Design',
    lastMessage: 'Sarah: The new mockups look great!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
    isOnline: false,
    avatar: null,
    isGroup: true,
  },
  {
    id: '3',
    name: 'Alice Johnson',
    lastMessage: 'Thanks for the help yesterday 👍',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 0,
    isOnline: false,
    avatar: null,
    isGroup: false,
  },
]

export function ConversationSidebar({
  selectedConversationId,
  onSelectConversation,
  collapsed,
  onToggleCollapse,
  onShowProfile,
  user,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = mockConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (collapsed) {
    return (
      <div className="h-full flex flex-col p-2">
        {/* Collapsed Header */}
        <div className="flex flex-col items-center space-y-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-12 h-12"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Separator />
        </div>

        {/* Collapsed Navigation */}
        <div className="flex flex-col space-y-2 flex-1">
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12">
            <Users className="w-5 h-5" />
          </Button>
        </div>

        {/* Collapsed Footer */}
        <div className="flex flex-col items-center space-y-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowProfile}
            className="w-12 h-12"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-xs">
                {getInitials(user.firstName + ' ' + user.lastName || user.username || 'U')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Chats</h1>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "conversation-item rounded-lg mb-1",
                  selectedConversationId === conversation.id && "active"
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.avatar || undefined} />
                      <AvatarFallback>
                        {conversation.isGroup ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          getInitials(conversation.name)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {!conversation.isGroup && conversation.isOnline && (
                      <div className="online-indicator" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 flex-1 justify-start"
            onClick={onShowProfile}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-xs">
                {getInitials(user.firstName + ' ' + user.lastName || user.username || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName + ' ' + user.lastName || user.username || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </Button>
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}