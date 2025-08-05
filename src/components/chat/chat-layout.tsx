"use client"

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ConversationSidebar } from './conversation-sidebar'
import { MessageArea } from './message-area'
import { WelcomeScreen } from './welcome-screen'
import { UserProfile } from './user-profile'
import { cn } from '@/lib/utils'

export function ChatLayout() {
  const { user, isLoaded } = useUser()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className={cn(
        "flex-shrink-0 border-r border-border bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-80"
      )}>
        <ConversationSidebar
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onShowProfile={() => setShowProfile(true)}
          user={user}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversationId ? (
          <MessageArea
            conversationId={selectedConversationId}
            onClose={() => setSelectedConversationId(null)}
          />
        ) : (
          <WelcomeScreen
            userName={user.firstName || user.username || 'there'}
            onStartChat={() => {
              // Logic to start a new chat
              console.log('Start new chat')
            }}
          />
        )}
      </div>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}