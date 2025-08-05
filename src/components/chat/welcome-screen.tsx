"use client"

import { MessageCircle, Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeScreenProps {
  userName: string
  onStartChat: () => void
}

export function WelcomeScreen({ userName, onStartChat }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
      <div className="text-center max-w-md mx-auto">
        {/* Welcome Icon */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-12 h-12 text-primary" />
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userName}! 👋
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Select a conversation from the sidebar to start chatting, or create a new one to connect with friends and colleagues.
        </p>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Start New Chat */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Start New Chat</h3>
                <p className="text-xs text-muted-foreground">
                  Find someone to chat with
                </p>
              </div>
            </div>
            <Button 
              onClick={onStartChat} 
              className="w-full"
              variant="outline"
            >
              New Conversation
            </Button>
          </div>

          {/* Create Group */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm">Create Group</h3>
                <p className="text-xs text-muted-foreground">
                  Start a group conversation
                </p>
              </div>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => console.log('Create group')}
            >
              New Group
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-left">
          <h4 className="font-medium text-sm mb-2">💡 Quick Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use Ctrl+K to quickly search conversations</li>
            <li>• Press Enter to send messages, Shift+Enter for new lines</li>
            <li>• Click on user avatars to view profiles</li>
            <li>• Use emojis and reactions to express yourself</li>
          </ul>
        </div>
      </div>
    </div>
  )
}