# Dev Flow — Stack Overflow Clone

<div align="center">

<img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />

**A full-stack Stack Overflow-style Q&A platform with AI-generated answers.**

[Live Demo](https://devflow-coral2.vercel.app) · [Report Bug](https://github.com/brandonperfetti/next-stack-overflow/issues)

</div>

---

## Overview

**Dev Flow** is a production-grade Stack Overflow clone built with the **Next.js 14 App Router**. It features a complete developer Q&A experience — from posting questions and writing rich-text answers to voting, tagging, reputation tracking, and AI-assisted answers powered by OpenAI.

This project demonstrates advanced Next.js patterns including server actions, route handlers, dynamic OG images, and Clerk webhooks for user sync.

---

## Features

- ❓ **Ask Questions** — Rich text editor (TinyMCE) with code blocks, formatting, and tag support
- 💬 **Answer System** — Write, edit, and delete answers with full rich text
- 👍 **Voting** — Upvote/downvote questions and answers; reputation system updates accordingly
- 🏷️ **Tagging** — Browse and filter by tags; tag detail pages show related questions
- 🔍 **Global Search** — Search across questions, answers, users, and tags simultaneously
- 🤖 **AI Answers** — Generate AI-powered answers via OpenAI integration
- 👤 **User Profiles** — Public profiles with stats, top questions, and top answers
- 🏆 **Reputation & Badges** — Earn reputation through community engagement
- 🌙 **Dark / Light Mode** — Persistent theme preference
- 🔐 **Authentication** — Clerk-powered auth with webhook-based user sync to MongoDB

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) (App Router) | Full-stack React framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database and ODM |
| [Clerk](https://clerk.com/) | Authentication and user management |
| [OpenAI API](https://platform.openai.com/docs/) | AI-generated answer feature |
| [TinyMCE](https://www.tiny.cloud/) | Rich text question/answer editor |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible component library |
| [Radix UI](https://www.radix-ui.com/) | Headless UI primitives |
| [Zod](https://zod.dev/) | Schema validation |
| [React Hook Form](https://react-hook-form.com/) | Form state management |
| [Svix](https://svix.com/) | Webhook verification for Clerk events |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Clerk](https://clerk.com/) application
- An [OpenAI](https://platform.openai.com/) API key
- A [TinyMCE](https://www.tiny.cloud/) API key

### Installation

```bash
git clone https://github.com/brandonperfetti/next-stack-overflow.git
cd next-stack-overflow
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Clerk Webhook (for user sync)
CLERK_WEBHOOK_SECRET=whsec_...

# MongoDB
MONGODB_URL=mongodb+srv://...

# OpenAI
OPENAI_API_KEY=sk-...

# TinyMCE
NEXT_PUBLIC_TINY_EDITOR_API_KEY=your_tinymce_api_key

# App
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
next-stack-overflow/
├── app/
│   ├── (auth)/           # Sign-in / Sign-up routes
│   ├── (root)/           # Main app routes
│   │   ├── Home/         # Home feed
│   │   ├── jobs/         # Job board
│   │   └── ...
│   └── api/              # Route handlers (webhooks, AI)
├── components/
│   ├── cards/            # Question, answer, user cards
│   ├── forms/            # Ask question, answer forms
│   ├── shared/           # Navbar, sidebar, search
│   └── ui/               # shadcn/ui base components
├── database/             # Mongoose models and schemas
├── lib/                  # Server actions, utilities, validations
├── context/              # Theme provider
├── types/                # TypeScript type definitions
└── constants/            # App-wide constants
```

---

## Deployment

Deploy to [Vercel](https://vercel.com/). Add all environment variables in your Vercel project settings. Configure Clerk webhooks to point to `https://your-domain.com/api/webhooks/clerk`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/brandonperfetti/next-stack-overflow)

---

## License

MIT © [Brandon Perfetti](https://brandonperfetti.com)
