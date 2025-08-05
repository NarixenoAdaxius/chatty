import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { ChatLayout } from '@/components/chat/chat-layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat - Chatty',
  description: 'Your conversations and messages',
}

export default async function ChatPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return <ChatLayout />
}