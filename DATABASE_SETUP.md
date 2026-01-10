# 🗄️ Database Setup Guide - Transfer Traders

Complete guide to setting up your PostgreSQL database with Prisma.

---

## 📋 Overview

Your database schema includes:
- ✅ **Users & Authentication** - User accounts with roles
- ✅ **Trader Profiles** - Elite trader accounts with stats & pricing
- ✅ **Subscriptions** - OnlyFans-style monthly/yearly subscriptions
- ✅ **Posts/Signals** - Trading tips with full metadata
- ✅ **Engagement** - Comments, likes, notifications
- ✅ **FUT Cards** - Player cards with market data
- ✅ **Portfolio** - User holdings and profit tracking
- ✅ **Price Alerts** - Custom price notifications
- ✅ **Achievements** - Gamification system
- ✅ **Stories** - Instagram-style 24hr content

---

## 🚀 Quick Start (Railway Deployment)

Railway will automatically install dependencies, but you need to run migrations manually the **first time**.

### Step 1: Generate Prisma Client

After Railway builds successfully, you need to generate the Prisma client:

**Option A: Use Railway CLI**
```bash
railway run npm run db:generate
```

**Option B: Add to Build Command (Recommended)**

Update your Railway **Custom Build Command** to:
```bash
npm install --include=dev && npx prisma generate && npm run build
```

### Step 2: Create Database Tables

Run the migration to create all tables in your Railway PostgreSQL:

**Option A: Use Railway CLI**
```bash
railway run npm run db:push
```

**Option B: Connect Directly**

Use the Railway PostgreSQL connection string from your `.env`:
```bash
DATABASE_URL="postgresql://postgres:jzvPbrChNSUgIBUIvwdxoArWKShiFcki@crossover.proxy.rlwy.net:47088/railway" npx prisma db push
```

### Step 3: Seed the Database (Optional but Recommended)

Populate with sample data (traders, posts, cards, etc.):

```bash
railway run npm run db:seed
```

Or directly:
```bash
DATABASE_URL="postgresql://postgres:jzvPbrChNSUgIBUIvwdxoArWKShiFcki@crossover.proxy.rlwy.net:47088/railway" npm run db:seed
```

---

## 💻 Local Development Setup

### Prerequisites

1. **Node.js 20+** installed
2. **PostgreSQL** installed locally OR use Railway database

### Option 1: Use Railway Database (Easiest)

Your `.env` file already points to Railway PostgreSQL:

```bash
DATABASE_URL=postgresql://postgres:jzvPbrChNSUgIBUIvwdxoArWKShiFcki@crossover.proxy.rlwy.net:47088/railway
```

Run migrations:
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Create tables
npm run db:seed      # Add sample data
```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL** (if not installed):
   - Mac: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from postgresql.org

2. **Create local database**:
   ```bash
   createdb futhub_dev
   ```

3. **Update `.env.local`**:
   ```bash
   DATABASE_URL="postgresql://localhost:5432/futhub_dev"
   ```

4. **Run migrations**:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

---

## 🔧 Available Database Commands

### Generate Prisma Client
```bash
npm run db:generate
```
Creates TypeScript types and client for database queries.

### Push Schema to Database
```bash
npm run db:push
```
Creates/updates tables without creating migration files. **Fast for development**.

### Create Migration (Production)
```bash
npm run db:migrate
```
Creates migration files and applies them. **Use this for production**.

### Deploy Migrations (Production)
```bash
npm run db:migrate:deploy
```
Applies pending migrations. **Used in CI/CD**.

### Open Prisma Studio (Database GUI)
```bash
npm run db:studio
```
Opens browser-based database editor at `http://localhost:5555`.

### Seed Database
```bash
npm run db:seed
```
Populates database with sample data from `prisma/seed.ts`.

---

## 📊 Sample Data Included

After running `npm run db:seed`, you'll have:

### Users
- **Regular User**: `user@transfertraders.com` / `password123`

### Traders
- **Nick RTFM**: `nick@transfertraders.com` / `password123`
  - Specialty: Quick Flips
  - Subscribers: 8,234
  - Win Rate: 94.5%

- **FUT Economist**: `futeconomist@transfertraders.com` / `password123`
  - Specialty: SBC Investing
  - Subscribers: 5,621
  - Win Rate: 89.2%

- **Icon King**: `iconking@transfertraders.com` / `password123`
  - Specialty: Icons & Heroes
  - Subscribers: 12,453
  - Win Rate: 91.8%

### Sample Content
- 4 trading signals (Quick Flips, SBC, Market Analysis)
- 3 FUT cards (Mbappé, Haaland, Bellingham)
- Active subscriptions
- Portfolio with profit tracking
- Price alerts
- Achievements
- Notifications

---

## 🔍 Viewing Your Data

### Option 1: Prisma Studio (GUI)
```bash
npm run db:studio
```
Opens at `http://localhost:5555` with full database browser.

### Option 2: psql (Command Line)
```bash
psql "postgresql://postgres:jzvPbrChNSUgIBUIvwdxoArWKShiFcki@crossover.proxy.rlwy.net:47088/railway"
```

Common queries:
```sql
-- List all tables
\dt

-- View users
SELECT * FROM "User";

-- View traders
SELECT * FROM "Trader";

-- View posts
SELECT * FROM "Post";
```

---

## 🚨 Troubleshooting

### Error: "Can't reach database server"

**Solution**: Check your `DATABASE_URL` in `.env`:
```bash
# Verify connection
npx prisma db push --preview-feature
```

### Error: "Environment variable not found: DATABASE_URL"

**Solution**: Make sure `.env` file exists in root directory:
```bash
# Check if .env exists
ls -la .env

# If missing, create it
cp .env.example .env
```

### Error: "Prisma schema not found"

**Solution**: Run from project root directory where `prisma/schema.prisma` exists:
```bash
cd /path/to/FUTHub
npm run db:generate
```

### Error: "P1001: Can't connect to database"

**Solution**: Railway PostgreSQL might be sleeping. Wait 30 seconds and retry:
```bash
npm run db:push
```

### Tables already exist

**Solution**: Reset database (⚠️ deletes all data):
```bash
npx prisma db push --force-reset
npm run db:seed  # Re-add sample data
```

---

## 🏗️ Database Schema Overview

### Core Tables

**User** - All user accounts
- id, email, username, password (hashed)
- role: USER | TRADER | ADMIN
- level, xp, verified status

**Trader** - Extended trader profiles
- userId (links to User)
- displayName, specialty, stats
- monthlyPrice, yearlyPrice
- verified, featured flags

**Subscription** - User → Trader subscriptions
- userId, traderId
- tier: MONTHLY | YEARLY
- status: ACTIVE | CANCELLED | EXPIRED
- Stripe integration fields

**Post** - Trading signals/content
- traderId, type (TRADE_TIP, QUICK_FLIP, etc.)
- playerName, buyPrice, targetPrice
- riskLevel, tradeStatus
- isPremium flag for subscriber-only content

**Card** - FUT player cards
- name, rating, position, nation, league
- platform (PS, XBOX, PC)
- currentPrice, priceHistory

**Portfolio** - User's card holdings
- userId, cardId
- buyPrice, currentPrice, sellPrice
- profit, roi calculation
- status: HOLDING | SOLD | LISTED

---

## 🎯 Next Steps

1. ✅ Run migrations: `npm run db:push`
2. ✅ Seed database: `npm run db:seed`
3. ✅ View data: `npm run db:studio`
4. 🔄 Build backend API (next step)
5. 🔄 Connect frontend to real data

---

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Railway Docs](https://docs.railway.app/databases/postgresql)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Database is ready! Time to build the API.** 🚀
