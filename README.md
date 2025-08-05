# Chatty - Modern Messaging Application

![Chatty Logo](public/chatty-logo.png)

Chatty is a modern, feature-rich messaging application built with cutting-edge web technologies. Experience seamless real-time communication with a beautiful, intuitive interface.

## ✨ Features

### Core Messaging
- 🚀 **Real-time messaging** with instant delivery
- 👥 **Group chats** with up to 256 members  
- 🎭 **Message reactions** and replies
- ✏️ **Edit and delete** messages
- 👀 **Typing indicators** and read receipts
- 🔍 **Message search** functionality

### User Experience
- 🌙 **Dark/Light theme** toggle
- 📱 **Fully responsive** design
- ⚡ **Lightning fast** performance
- 🎨 **Beautiful UI** with smooth animations
- 🔔 **Push notifications** support
- ♿ **Accessibility** features

### Media & Files
- 📸 **Image sharing** with preview
- 📎 **File attachments** support
- 😊 **Emoji picker** and reactions
- 🎵 **Voice messages** (coming soon)

### Security & Privacy
- 🔐 **Secure authentication** with Clerk
- 🛡️ **Protected routes** and API endpoints
- 🔒 **Data validation** and sanitization
- 🚨 **Rate limiting** for API protection

## 🛠️ Tech Stack

- **Frontend & Backend**: [Next.js 14+](https://nextjs.org/) with App Router
- **Authentication**: [Clerk](https://clerk.com/) for user management
- **Database**: [Convex](https://convex.dev/) for real-time data sync
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Deployment**: [Vercel](https://vercel.com/) hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A [Clerk](https://clerk.com) account (free tier available)
- A [Convex](https://convex.dev) account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chatty.git
   cd chatty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your actual keys in `.env.local` (see [Setup Guide](SETUP_GUIDE.md) for details)

4. **Initialize Convex**
   ```bash
   npx convex dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see our [Setup Guide](SETUP_GUIDE.md).

## 📖 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete setup instructions
- [Requirements](requirements.md) - Functional and technical requirements
- [Design Document](design.md) - UI/UX and architecture decisions

## 🏗️ Project Structure

```
chatty/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── chat/              # Main chat application
│   │   ├── sign-in/           # Authentication pages
│   │   └── api/               # API routes and webhooks
│   ├── components/            # React components
│   │   ├── chat/              # Chat-specific components
│   │   ├── ui/                # Reusable UI components
│   │   └── providers/         # Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── constants/             # Application constants
├── convex/                    # Convex database schema and functions
├── public/                    # Static assets
└── docs/                      # Documentation files
```

## 🎨 UI Components

Chatty uses [ShadCN UI](https://ui.shadcn.com/) for consistent, accessible components:

- **Chat Interface**: Custom message bubbles, conversation sidebar
- **Authentication**: Styled Clerk components with theme integration
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Toast notifications with Sonner
- **Theme System**: Dark/light mode with next-themes

## 🔐 Environment Variables

Required environment variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex Database  
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
CONVEX_DEPLOY_KEY=...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-32-character-secret-key
```

See `.env.example` for the complete list.

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Add all required environment variables
   - Update URLs for production

3. **Deploy Convex to production**
   ```bash
   npx convex deploy
   ```

4. **Update Clerk settings**
   - Set production URLs in Clerk dashboard
   - Configure webhooks for production

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Convex](https://convex.dev) for real-time database
- [ShadCN](https://ui.shadcn.com) for UI components
- [Lucide](https://lucide.dev) for beautiful icons
- [Vercel](https://vercel.com) for hosting

## 📊 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

---

**Built with ❤️ by the Chatty Team**

[Demo](https://chatty-demo.vercel.app) • [Documentation](SETUP_GUIDE.md) • [Issues](https://github.com/your-username/chatty/issues)