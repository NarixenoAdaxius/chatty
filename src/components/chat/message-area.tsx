"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

import { cn } from '@/lib/utils'

interface MessageAreaProps {
  conversationId: string
  onClose?: () => void
}

// Mock messages data
const mockMessages = [
  {
    id: '1',
    content: 'Hey! How are you doing today?',
    senderId: 'other',
    senderName: 'John Doe',
    senderAvatar: null,
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    content: "I'm doing great! Just finished working on the new Chatty features. What about you?",
    senderId: 'me',
    senderName: 'You',
    senderAvatar: null,
    timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
    status: 'read',
    type: 'text',
  },
  {
    id: '3',
    content: 'That sounds awesome! I\'d love to hear more about it. Are you free for a quick call later?',
    senderId: 'other',
    senderName: 'John Doe',
    senderAvatar: null,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: 'read',
    type: 'text',
  },
  {
    id: '4',
    content: 'Sure! I should be free around 3 PM. Let me know what works for you 👍',
    senderId: 'me',
    senderName: 'You',
    senderAvatar: null,
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    status: 'read',
    type: 'text',
  },
]

const mockConversation = {
  id: '1',
  name: 'John Doe',
  isGroup: false,
  isOnline: true,
  avatar: null,
  participants: ['me', 'other'],
}

export function MessageArea({ onClose }: MessageAreaProps) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // TODO: Implement actual message sending with Convex
    console.log('Sending message:', newMessage)
    setNewMessage('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile back button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            {/* Avatar and info */}
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={mockConversation.avatar || undefined} />
                <AvatarFallback>
                  {getInitials(mockConversation.name)}
                </AvatarFallback>
              </Avatar>
              {mockConversation.isOnline && !mockConversation.isGroup && (
                <div className="online-indicator" />
              )}
            </div>

            <div>
              <h2 className="font-semibold text-sm">
                {mockConversation.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {mockConversation.isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mockMessages.map((message, index) => {
            const isMe = message.senderId === 'me'
            const showAvatar = !isMe && (
              index === 0 || 
              mockMessages[index - 1].senderId !== message.senderId
            )
            const showTimestamp = (
              index === mockMessages.length - 1 ||
              mockMessages[index + 1].senderId !== message.senderId ||
              (mockMessages[index + 1].timestamp.getTime() - message.timestamp.getTime()) > 5 * 60 * 1000
            )

            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end space-x-2",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                {/* Avatar for received messages */}
                {!isMe && (
                  <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.senderAvatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(message.senderName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}

                {/* Message bubble */}
                <div className={cn(
                  "max-w-[70%] flex flex-col",
                  isMe ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "message-bubble",
                    isMe ? "sent" : "received"
                  )}>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  
                  {/* Timestamp and status */}
                  {showTimestamp && (
                    <div className={cn(
                      "flex items-center space-x-1 mt-1",
                      isMe ? "justify-end" : "justify-start"
                    )}>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {isMe && (
                        <span className="text-xs text-muted-foreground">
                          {message.status === 'read' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {false && (
            <div className="flex items-end space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={mockConversation.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(mockConversation.name)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-end space-x-2">
          {/* Attachment button */}
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Message input */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 resize-none"
              autoFocus
            />
            
            {/* Emoji button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {/* Send button */}
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}