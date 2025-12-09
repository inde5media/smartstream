# StreamSmart - Voice + Avatar AI Discovery Platform

**Hackathon:** Agentics Foundation TV5 Hackathon  
**Demo:** [Link to live demo]  
**Video:** [Link to demo video]

## 🎯 Problem We're Solving

The **45-minute scroll problem** - users spend too long finding content across multiple streaming platforms. StreamSmart solves this with AI-powered voice discovery in under 60 seconds.

## 🚀 Solution

- **Voice OR Avatar-guided discovery** - Choose your experience (ANAM CARA II avatar or voice-only) - https://anam.referral-factory.com/ulk7ZvjH
- **96x faster semantic search** - AgentDB vector search understands meaning, not just keywords
- **Cross-platform recommendations** - One query searches TV5Monde, Netflix, HBO, Disney+
- **One-tap launch** - Deep links directly to streaming apps

## 🏗️ Architecture
```
Frontend: Lovable.dev (React + Tailwind + shadcn/ui)
Backend: Next.js API Routes + Node.js
Database: Supabase + AgentDB v1.3.9
Voice: Switchboard SDK + Deepgram (STT)
Avatar: ANAM (conversational avatar)
AI: Claude 4 (recommendations)
```

## 🎬 Demo Flow

1. User asks: "Show me something like The Crown"
2. Claude extracts intent (royal intrigue, political drama)
3. AgentDB semantic search (< 1ms)
4. Avatar/voice responds with recommendations
5. One tap to launch on TV5Monde/Netflix

## 📊 Key Metrics

- **Response time:** < 2 seconds (voice query to recommendations)
- **Search speed:** 96-164x faster than traditional search
- **Accuracy:** Semantic understanding, not keyword matching
- **Platforms:** TV5Monde, Netflix, HBO, Disney+ (with deep linking)

## 🧪 Technical Highlights

- **London School TDD** - Outside-in testing with 80%+ coverage
- **AgentDB Integration** - Self-improving vector search with RL
- **Prompt Caching** - 90% cost reduction on Claude API calls
- **Hybrid Mode** - Avatar OR voice-only (user preference/tier)

## 📁 Repository Structure
```
/frontend          # Lovable.dev React app
/backend           # Next.js API routes
/tests             # E2E, integration, unit tests
/docs              # Full PRD and specifications
/scripts           # Content ingestion scripts
```

## 🔗 Documentation

- [Full PRD](./docs/PRD.md) - Complete development specification
- [API Documentation](./docs/API.md)
- [Testing Strategy](./docs/TESTING.md)

## 🎯 Hackathon Goals

✅ Functional MVP with voice/avatar discovery  
✅ TV5Monde + Netflix integration  
✅ AgentDB semantic search  
✅ 80%+ test coverage  
✅ Production-ready deployment plan

---

**Built with:** Claude 4, AgentDB, Supabase, ANAM, Switchboard, Deepgram  
**Team:** Agent86 by Mat  
**Contact:** [Your contact info]


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
