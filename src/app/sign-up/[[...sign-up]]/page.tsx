import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Chatty',
  description: 'Create your Chatty account and start messaging with friends',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Join Chatty Today
          </h1>
          <p className="text-muted-foreground">
            Create your account and start connecting with others
          </p>
        </div>
        
        <div className="glass rounded-lg p-1">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none border-0",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "bg-background hover:bg-accent border border-border",
                socialButtonsBlockButtonText: "text-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewText: "text-foreground",
                identityPreviewEditButton: "text-primary hover:text-primary/80",
                formFieldInput: "bg-background border-border text-foreground",
                formFieldLabel: "text-foreground",
                otpCodeFieldInput: "bg-background border-border text-foreground",
                formHeaderTitle: "text-foreground",
                formHeaderSubtitle: "text-muted-foreground",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}