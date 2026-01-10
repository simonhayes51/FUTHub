# 🚀 Transfer Traders API Documentation

Complete API reference for the Transfer Traders platform.

**Base URL**: `https://your-railway-app.railway.app/api`
**Local Dev**: `http://localhost:3000/api`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### POST `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "futtrader",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "username": "futtrader",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=futtrader",
    "role": "USER"
  }
}
```

### POST `/api/auth/login`

Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "username": "futtrader",
    "avatar": "https://...",
    "role": "USER",
    "level": 5,
    "xp": 450,
    "trader": null
  }
}
```

### GET `/api/auth/me` 🔒

Get current authenticated user.

**Response:** `200 OK`
```json
{
  "id": "clx...",
  "email": "user@example.com",
  "username": "futtrader",
  "avatar": "https://...",
  "bio": "Just here to make coins!",
  "level": 5,
  "xp": 450,
  "role": "USER",
  "verified": false,
  "trader": null
}
```

---

## 👥 Traders

### GET `/api/traders`

Get all traders with optional filtering.

**Query Parameters:**
- `specialty` - Filter by specialty ("Quick Flips", "SBC", etc.)
- `featured` - Show only featured traders (`true`/`false`)
- `search` - Search by name or specialty

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "displayName": "Nick RTFM",
    "specialty": "Quick Flips",
    "totalProfit": 2500000,
    "winRate": 94.5,
    "avgROI": 45,
    "totalTrades": 1247,
    "subscriberCount": 8234,
    "monthlyPrice": 19.99,
    "yearlyPrice": 199.99,
    "verified": true,
    "featured": true,
    "user": {
      "username": "nickrtfm",
      "avatar": "https://...",
      "verified": true
    },
    "_count": {
      "subscribers": 8234,
      "posts": 156
    }
  }
]
```

### GET `/api/traders/:id`

Get single trader by ID.

**Response:** `200 OK` (same format as above)

### POST `/api/traders/:id/subscribe` 🔒

Subscribe to a trader.

**Request Body:**
```json
{
  "tier": "MONTHLY"  // or "YEARLY"
}
```

**Response:** `200 OK`
```json
{
  "id": "clx...",
  "userId": "clx...",
  "traderId": "clx...",
  "tier": "MONTHLY",
  "status": "ACTIVE",
  "startDate": "2026-01-10T00:00:00.000Z",
  "renewalDate": "2026-02-10T00:00:00.000Z",
  "amount": 19.99
}
```

### DELETE `/api/traders/:id/subscribe` 🔒

Unsubscribe from a trader.

**Response:** `200 OK`
```json
{
  "message": "Unsubscribed successfully"
}
```

### GET `/api/traders/:id/posts`

Get all posts from a specific trader.

**Query Parameters:**
- `limit` - Number of posts (default: 10)
- `offset` - Pagination offset (default: 0)

**Response:** `200 OK` (array of posts - see Posts section)

---

## 📝 Posts & Feed

### GET `/api/posts/feed` 🔒

Get personalized feed based on subscriptions.

**Query Parameters:**
- `limit` - Number of posts (default: 20)
- `offset` - Pagination offset (default: 0)
- `type` - Filter by post type (TRADE_TIP, QUICK_FLIP, etc.)

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "type": "QUICK_FLIP",
    "title": "🔥 Quick Flip Alert - Mbappé",
    "content": "Mbappé is currently undervalued...",
    "playerName": "Kylian Mbappé",
    "cardType": "Gold Rare",
    "rating": 91,
    "buyPriceMin": 275000,
    "buyPriceMax": 285000,
    "targetPrice": 295000,
    "riskLevel": "SAFE",
    "tradeStatus": "ACTIVE",
    "isPremium": false,
    "likesCount": 234,
    "commentsCount": 45,
    "viewsCount": 1523,
    "isLiked": true,
    "createdAt": "2026-01-10T00:00:00.000Z",
    "trader": {
      "id": "clx...",
      "displayName": "Nick RTFM",
      "specialty": "Quick Flips",
      "user": {
        "username": "nickrtfm",
        "avatar": "https://...",
        "verified": true
      }
    },
    "_count": {
      "comments": 45,
      "likes": 234
    }
  }
]
```

### GET `/api/posts/:id`

Get single post by ID.

**Response:** `200 OK` (same format as feed item)

### POST `/api/posts` 🔒 (Traders Only)

Create a new trading signal/post.

**Request Body:**
```json
{
  "type": "QUICK_FLIP",
  "title": "Quick Flip Alert",
  "content": "Buy Haaland now!",
  "playerName": "Erling Haaland",
  "cardType": "Gold Rare",
  "rating": 91,
  "buyPriceMin": 240000,
  "buyPriceMax": 250000,
  "targetPrice": 275000,
  "riskLevel": "MEDIUM",
  "tradeStatus": "ACTIVE",
  "isPremium": false
}
```

**Response:** `201 Created` (post object)

### POST `/api/posts/:id/like` 🔒

Like or unlike a post.

**Response:** `200 OK`
```json
{
  "liked": true  // or false if unliked
}
```

### GET `/api/posts/:id/comments`

Get all comments for a post.

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "content": "Just made 45k following this tip!",
    "createdAt": "2026-01-10T00:00:00.000Z",
    "user": {
      "id": "clx...",
      "username": "futfan",
      "avatar": "https://...",
      "verified": false
    },
    "replies": []
  }
]
```

### POST `/api/posts/:id/comments` 🔒

Add a comment to a post.

**Request Body:**
```json
{
  "content": "Great tip!",
  "parentId": null  // or comment ID for replies
}
```

**Response:** `201 Created` (comment object)

---

## 💼 Portfolio

### GET `/api/portfolio` 🔒

Get user's portfolio with stats.

**Query Parameters:**
- `status` - Filter by status (HOLDING, SOLD, LISTED)

**Response:** `200 OK`
```json
{
  "portfolio": [
    {
      "id": "clx...",
      "quantity": 2,
      "buyPrice": 280000,
      "currentPrice": 285000,
      "status": "HOLDING",
      "profit": 10000,
      "roi": 1.8,
      "purchasedAt": "2026-01-10T00:00:00.000Z",
      "card": {
        "id": "clx...",
        "name": "Kylian Mbappé",
        "rating": 91,
        "cardType": "Gold Rare",
        "platform": "PS",
        "currentPrice": 285000
      }
    }
  ],
  "stats": {
    "totalValue": 570000,
    "totalInvested": 560000,
    "totalProfit": 25000,
    "activeInvestments": 2,
    "winRate": 75
  }
}
```

### POST `/api/portfolio` 🔒

Add card to portfolio.

**Request Body:**
```json
{
  "cardId": "clx...",
  "quantity": 1,
  "buyPrice": 240000
}
```

**Response:** `201 Created` (portfolio item)

### PATCH `/api/portfolio/:id` 🔒

Update portfolio item.

**Request Body:**
```json
{
  "currentPrice": 255000,
  "sellPrice": 255000,
  "status": "SOLD"
}
```

**Response:** `200 OK` (updated portfolio item)

### DELETE `/api/portfolio/:id` 🔒

Delete portfolio item.

**Response:** `200 OK`
```json
{
  "message": "Portfolio item deleted"
}
```

---

## 🔔 Notifications

### GET `/api/notifications` 🔒

Get user's notifications.

**Query Parameters:**
- `unreadOnly` - Show only unread (`true`/`false`)
- `limit` - Number to return (default: 20)

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": "clx...",
      "type": "TRADE_ALERT",
      "title": "New Trading Signal",
      "message": "Nick RTFM just posted a new Quick Flip opportunity",
      "link": "/post/clx...",
      "read": false,
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  ],
  "unreadCount": 3
}
```

### PATCH `/api/notifications/:id/read` 🔒

Mark notification as read.

**Response:** `200 OK` (updated notification)

### POST `/api/notifications/read-all` 🔒

Mark all notifications as read.

**Response:** `200 OK`
```json
{
  "message": "All notifications marked as read"
}
```

### DELETE `/api/notifications/:id` 🔒

Delete notification.

**Response:** `200 OK`

---

## 🃏 Cards

### GET `/api/cards/search`

Search for FUT cards.

**Query Parameters:**
- `q` - Search query (name, club, league)
- `platform` - Platform (PS, XBOX, PC) (default: PS)
- `limit` - Number of results (default: 20)

**Response:** `200 OK`
```json
[
  {
    "id": "clx...",
    "name": "Kylian Mbappé",
    "rating": 91,
    "position": "ST",
    "nation": "France",
    "league": "La Liga",
    "club": "Real Madrid",
    "cardType": "Gold Rare",
    "platform": "PS",
    "currentPrice": 285000,
    "priceHistory": []
  }
]
```

### GET `/api/cards/trending`

Get trending cards based on recent posts.

**Query Parameters:**
- `platform` - Platform (default: PS)
- `limit` - Number of cards (default: 10)

**Response:** `200 OK` (array of cards)

### GET `/api/cards/:id`

Get single card by ID.

**Response:** `200 OK` (card object)

### GET `/api/cards/:id/history`

Get price history for a card.

**Response:** `200 OK`
```json
{
  "id": "clx...",
  "name": "Kylian Mbappé",
  "priceHistory": [
    { "date": "2026-01-01", "price": 270000 },
    { "date": "2026-01-10", "price": 285000 }
  ]
}
```

---

## 🔧 Utility

### GET `/api/health`

Health check endpoint.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-01-10T00:00:00.000Z",
  "environment": "production"
}
```

---

## 🚨 Error Responses

All endpoints may return these error codes:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authenticated" | "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📊 Rate Limiting

Currently no rate limiting implemented. Will be added in future updates.

---

## 🔄 Pagination

Most list endpoints support pagination via `limit` and `offset`:

```
GET /api/traders?limit=20&offset=40
```

- `limit`: Number of items per page
- `offset`: Number of items to skip

---

## 🧪 Testing

Use tools like:
- **Postman**: Import endpoints and test
- **cURL**: Command-line testing
- **Thunder Client** (VS Code): API client extension

**Example cURL:**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@transfertraders.com","password":"password123"}'

# Get feed (with token)
curl http://localhost:3000/api/posts/feed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**API Version**: 1.0.0
**Last Updated**: 2026-01-10
