# 🚀 Getting Started - Transfer Traders Platform

Complete guide to get your FUT trading platform up and running.

---

## 📋 Prerequisites

- ✅ Node.js 20+ installed
- ✅ Git installed
- ✅ Railway account with PostgreSQL database
- ✅ Database credentials (already in `.env`)

---

## 🎯 Quick Start (3 Steps)

### Step 1: Set Up Database

**Run these commands to create tables and seed data:**

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Populate with sample data
npm run db:seed
```

**Expected Output:**
```
✅ Database seeded successfully!

📊 Summary:
  - Users: 5 created
  - Traders: 4 created
  - Posts: 4 created
  - Cards: 3 created
  - Subscriptions: 2 created
  - Achievements: 4 created

🔑 Login credentials:
  Email: user@transfertraders.com
  Password: password123
```

### Step 2: Start Development Server

**Run both frontend and backend:**

```bash
npm run dev
```

This starts:
- ✅ Frontend (Vite): `http://localhost:8080`
- ✅ Backend (Express): `http://localhost:3000`

### Step 3: Open and Test

1. **Open browser**: `http://localhost:8080`
2. **Click "Get Started"** → Goes to `/feed`
3. **Login** with seeded credentials
4. **Explore the platform!**

---

## 🏗️ Project Structure

```
/FUTHub
├── /src                 # Frontend (React + TypeScript)
│   ├── /components      # UI components
│   ├── /pages           # Page components
│   └── App.tsx          # React app
├── /server              # Backend (Express + TypeScript)
│   ├── /routes          # API endpoints
│   ├── /middleware      # Auth middleware
│   ├── /lib             # Prisma client
│   └── index.ts         # Express server
├── /prisma              # Database
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
├── package.json         # Dependencies & scripts
├── .env                 # Environment variables
└── railway.toml         # Railway deployment config
```

---

## 🗄️ Database Overview

**17 Tables Created:**

**Core:**
- `User` - User accounts with authentication
- `Trader` - Elite trader profiles with stats
- `Subscription` - User → Trader subscriptions

**Content:**
- `Post` - Trading signals and tips
- `Comment` - Post comments (with nested replies)
- `Like` - Post likes
- `Story` - 24hr Instagram-style stories

**Trading:**
- `Card` - FUT player cards with market data
- `Portfolio` - User's card holdings
- `PriceAlert` - Custom price notifications

**Engagement:**
- `Notification` - Multi-type notifications
- `Achievement` - Gamification achievements
- `UserAchievement` - User progress tracking
- `Message` - Direct messaging

---

## 🔑 Sample Login Credentials

After running `npm run db:seed`:

**Regular User:**
- Email: `user@transfertraders.com`
- Password: `password123`

**Traders:**
- Email: `nick@transfertraders.com`
- Password: `password123`

- Email: `futeconomist@transfertraders.com`
- Password: `password123`

- Email: `iconking@transfertraders.com`
- Password: `password123`

---

## 🎨 Frontend Features

**Pages:**
- `/` - Landing page with hero, features, traders
- `/feed` - Main app with personalized feed
- Discover, Notifications, Profile, Trader Profiles

**Features:**
- Instagram-style feed with stories
- Trading signals with card details
- Portfolio tracking
- Price alerts
- Achievements system
- Comments & likes
- Subscription management

---

## 🔌 Backend API

**Available at:** `http://localhost:3000/api`

**Endpoints:**
- `/api/auth` - Login, register, get user
- `/api/traders` - Get traders, subscribe
- `/api/posts` - Feed, create posts, like, comment
- `/api/portfolio` - Track holdings & profit
- `/api/notifications` - Get notifications
- `/api/cards` - Search cards, trending

**Full API docs:** See `API_DOCUMENTATION.md`

---

## 🛠️ Development Commands

### Frontend
```bash
npm run dev:frontend    # Start Vite dev server only
npm run build           # Build for production
npm run preview         # Preview production build
```

### Backend
```bash
npm run dev:backend     # Start Express server only
npm run dev             # Start both frontend + backend
npm run start           # Production mode
```

### Database
```bash
npm run db:generate     # Generate Prisma client
npm run db:push         # Update database schema
npm run db:seed         # Populate with sample data
npm run db:studio       # Open Prisma Studio GUI (http://localhost:5555)
npm run db:migrate      # Create migration files
```

---

## 🚂 Railway Deployment

**Railway will automatically:**
1. Install dependencies
2. Generate Prisma client
3. Build frontend
4. Start Express server

**After first deploy, run ONCE:**
```bash
# Option 1: Use Railway CLI
railway run npm run db:push
railway run npm run db:seed

# Option 2: Use connection string
DATABASE_URL="your-railway-postgres-url" npm run db:push
DATABASE_URL="your-railway-postgres-url" npm run db:seed
```

**Environment Variables in Railway:**
- ✅ `DATABASE_URL` - Set automatically by PostgreSQL plugin
- ✅ `JWT_SECRET` - Already configured
- ✅ `PORT` - Set automatically by Railway
- ✅ `NODE_ENV` - Set to `production` automatically

---

## 🔍 Verify Everything Works

### 1. Check Database
```bash
npm run db:studio
```
Opens Prisma Studio → Browse tables → Verify data

### 2. Test API
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"ok",...}`

### 3. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@transfertraders.com","password":"password123"}'
```
Should return JWT token

### 4. Open Frontend
Go to `http://localhost:8080` → Click around → Should work!

---

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm run db:generate
```

### "Can't reach database server"
**Solution:** Check DATABASE_URL in `.env` is correct

### "Port 3000 already in use"
**Solution:**
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run start
```

### "Prisma schema not found"
**Solution:** Make sure you're in project root directory

### Frontend shows blank page
**Solution:**
1. Check console for errors
2. Verify backend is running (`http://localhost:3000/api/health`)
3. Check CORS settings if using different ports

---

## 📚 Next Steps

### Immediate (Frontend Connected to Backend):
- [ ] Update frontend to use real API calls
- [ ] Add React Query for data fetching
- [ ] Implement authentication state management
- [ ] Connect forms to POST endpoints

### Short-term (Core Features):
- [ ] Add Stripe payment integration
- [ ] Implement real-time price updates
- [ ] Add WebSocket for live notifications
- [ ] Build trader dashboard

### Long-term (Advanced Features):
- [ ] FUT price API integration (FUTBIN/FUTWIZ)
- [ ] Advanced analytics for traders
- [ ] Direct messaging system
- [ ] Mobile app (React Native)

---

## 📖 Documentation

- **Setup**: This file
- **Database**: `DATABASE_SETUP.md`
- **API**: `API_DOCUMENTATION.md`
- **Railway**: `RAILWAY_SETUP.md`

---

## 🎉 You're Ready!

Your platform is now fully functional with:
- ✅ Complete database with 17 tables
- ✅ Backend API with JWT authentication
- ✅ Sample data (4 traders, posts, cards)
- ✅ Beautiful frontend UI
- ✅ Ready for Railway deployment

**Start coding and build something amazing!** 🚀

---

**Need help?** Check the docs or create an issue in the repository.

**Happy trading!** 💰
