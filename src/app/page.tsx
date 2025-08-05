import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MessageCircle, Users, Zap, Shield, Smartphone, Globe } from 'lucide-react'

export default async function HomePage() {
  const user = await currentUser()

  // If user is authenticated, redirect to chat
  if (user) {
    redirect('/chat')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Chatty</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex space-x-2">
              <Button asChild variant="ghost">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Connect with{' '}
            <span className="gradient-text">
              friends
            </span>
            {' '}instantly
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience seamless real-time messaging with modern features, 
            secure conversations, and an intuitive interface designed for 
            today&apos;s communication needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/sign-up">
                Start Chatting Now
                <MessageCircle className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/sign-in">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">Chatty</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with modern technology to deliver the best messaging experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Real-time Messaging */}
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Real-time messaging with instant delivery and typing indicators. 
              Experience conversations that flow naturally.
            </p>
          </div>

          {/* Group Chats */}
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Group Conversations</h3>
            <p className="text-muted-foreground">
              Create group chats with up to 256 members. Perfect for teams, 
              friends, and family conversations.
            </p>
          </div>

          {/* Secure */}
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your conversations are protected with enterprise-grade security 
              and modern authentication.
            </p>
          </div>

          {/* Mobile Responsive */}
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Mobile Ready</h3>
            <p className="text-muted-foreground">
              Fully responsive design that works perfectly on desktop, 
              tablet, and mobile devices.
            </p>
          </div>

          {/* File Sharing */}
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rich Media</h3>
            <p className="text-muted-foreground">
              Share images, files, and media seamlessly. Support for emojis, 
              reactions, and rich formatting.
            </p>
          </div>

          {/* Modern UI */}
          <div className="glass p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Beautiful Interface</h3>
            <p className="text-muted-foreground">
              Clean, modern design with dark/light themes and intuitive 
              navigation for the best user experience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass p-12 rounded-lg text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Ready to start chatting?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust Chatty for their daily communications
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/sign-up">
              Create Your Account
              <MessageCircle className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageCircle className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">Chatty</span>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>&copy; 2024 Chatty. Built with Next.js, Clerk, and Convex.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}