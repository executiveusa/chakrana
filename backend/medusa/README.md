# Chakrana Medusa Backend

A Medusa-powered e-commerce backend with integrated blog module and autonomous AI sales avatar.

## Overview

This backend provides:

- **E-commerce functionality** via Medusa core
- **Blog module** for content marketing and SEO
- **AI Avatar Chat** endpoint for conversational sales
- **Scheduled outbound campaigns** for customer engagement

## Features

### Blog Module

The blog module (`/store/blog/*` and `/admin/blog/*`) enables content-driven commerce:

#### Storefront Routes
- `GET /store/blog/posts` - List published posts with optional search and tag filters
- `GET /store/blog/posts/:slug` - Get a single published post by slug
- `GET /store/blog/tags` - List all tags

#### Admin Routes
- `GET /admin/blog/posts` - List all posts by status
- `POST /admin/blog/posts` - Create a draft post
- `PATCH /admin/blog/posts/:id` - Update post (including publish)
- `DELETE /admin/blog/posts/:id` - Delete a post

### AI Avatar Chat

The AI chat endpoint (`POST /store/ai/chat`) enables conversational commerce:

```json
// Request
{
  "conversation_id": "optional-existing-id",
  "message": "I'm looking for chakra meditation tools",
  "customer": {
    "id": "cust_123",
    "email": "user@example.com",
    "locale": "en-US",
    "region_id": "reg_us"
  },
  "cart_id": "cart_abc",
  "avatar_id": "chakrana-guide",
  "client_view": {
    "page": "Home",
    "url": "https://chakrana.com/",
    "device": "desktop"
  }
}

// Response
{
  "conversation_id": "conv_123_abc",
  "avatar_reply": {
    "reply_text": "I'd love to help you find the perfect meditation tools...",
    "emotion": "happy",
    "animation_key": null,
    "speech_hint": "normal"
  },
  "cart_delta": {
    "action": "none",
    "cart_id": "cart_abc"
  },
  "suggested_actions": [
    {
      "type": "show_product",
      "payload": { "category": "meditation-tools" }
    }
  ]
}
```

### Scheduled Jobs

- **ai-sales-daily-outbound**: Runs daily at 9 AM to process outbound campaigns

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
cd backend/medusa
npm install
```

### Configuration

1. Copy the environment template:
```bash
cp .env.template .env
```

2. Configure the required variables:
```env
DATABASE_URL=postgres://user:password@localhost:5432/medusa-chakrana
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secure-jwt-secret
COOKIE_SECRET=your-secure-cookie-secret
AI_GATEWAY_URL=http://localhost:3100
AI_GATEWAY_API_KEY=your-api-key
```

### Database Setup

```bash
# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### Development

```bash
npm run dev
```

The server starts at `http://localhost:9000`.

### Production

```bash
npm run build
npm run start
```

## Architecture

```
backend/medusa/
├── src/
│   ├── api/                    # Custom API routes
│   │   └── routes/
│   │       └── ai-chat-routes.ts
│   ├── jobs/                   # Scheduled jobs
│   │   └── ai-sales-daily-outbound.ts
│   ├── migrations/             # Database migrations
│   ├── modules/
│   │   └── blog/              # Blog module
│   │       ├── models/
│   │       ├── services/
│   │       └── routes/
│   └── services/              # Core services
│       └── ai-gateway-service.ts
├── data/                       # Seed data
├── medusa-config.js           # Medusa configuration
└── package.json
```

## API Reference

### Avatar Emotions

The avatar supports these emotions for contextual responses:
- `neutral` - Default state
- `happy` - Positive interactions
- `excited` - Special offers or discoveries
- `curious` - Asking questions
- `thinking` - Processing complex requests
- `reassuring` - Handling concerns
- `apologetic` - Error recovery

### Suggested Actions

The avatar can suggest these actions:
- `go_to_checkout` - Proceed to checkout
- `show_product` - Navigate to product(s)
- `show_blog_post` - Navigate to blog content
- `none` - No specific action

## Integration

### Frontend Integration

Use the provided store adapter:

```typescript
import { medusaStore } from "./lib/medusa";

// Send a message to the avatar
const response = await medusaStore.sendToStoreAvatar("Hello!");
console.log(response.avatar_reply.reply_text);

// List blog posts
const posts = await medusaStore.listBlogPosts({ limit: 10 });
```

### AI Gateway Integration

The AI Gateway service connects to your CrewAI or similar multi-agent system. Configure the URL and API key in your environment variables.

## License

MIT
