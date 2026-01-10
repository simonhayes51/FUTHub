# Railway Deployment Setup - Transfer Traders

## 🚀 Current Deployment Status

**Type**: Frontend-only (Static React App)
**Build Tool**: Vite
**Server**: `serve` (static file server)
**Node Version**: 20.x

---

## ✅ Required Environment Variables

### For Railway Dashboard

Set these in your Railway project settings (Variables tab):

```bash
# ✅ ALREADY CONFIGURED
DATABASE_URL=postgresql://postgres:jzvPbrChNSUgIBUIvwdxoArWKShiFcki@crossover.proxy.rlwy.net:47088/railway
JWT_SECRET=1ed7158e5f237cd10c501b0dd984cf14

# 🔄 Railway automatically sets this - DO NOT SET MANUALLY
PORT=<auto-assigned>
```

### When Adding Stripe (Future)

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### When Adding FUT Price APIs (Future)

```bash
FUTBIN_API_KEY=your-api-key
```

### When Going to Production

```bash
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

---

## 📦 Build Configuration

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "npm-9_x"]

[phases.install]
cmds = ["npm ci --include=dev"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start"
```

### railway.toml
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start"
```

### .npmrc
```ini
include=dev
```

**Why these settings?**
- `npm ci --include=dev`: Ensures build tools (vite) are installed
- `nodejs_20`: Matches `package.json` engine requirement
- `include=dev`: Prevents Railway from skipping devDependencies

---

## 🔧 Build Process Flow

1. **Setup Phase**: Install Node.js 20 and npm
2. **Install Phase**: Run `npm ci --include=dev` (clean install with devDependencies)
3. **Build Phase**: Run `npm run build` (Vite builds to `/dist`)
4. **Start Phase**: Run `npm run start` (serve static files from `/dist`)

---

## 🗄️ Database Setup

### Railway PostgreSQL

**Connection Details:**
- **Host**: crossover.proxy.rlwy.net
- **Port**: 47088
- **Database**: railway
- **User**: postgres
- **Connection String**: `postgresql://postgres:jzvPbrChNSUgIBUIvwdxoArWKShiFcki@crossover.proxy.rlwy.net:47088/railway`

### Next Steps for Backend

When you're ready to add a backend:

1. **Install Prisma**:
   ```bash
   npm install prisma @prisma/client
   npm install -D prisma
   ```

2. **Initialize Prisma**:
   ```bash
   npx prisma init
   ```

3. **Create Schema** in `prisma/schema.prisma`

4. **Run Migrations**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Deploy to Railway**:
   Railway will automatically run migrations if you add:
   ```toml
   # In railway.toml
   [deploy]
   startCommand = "npx prisma migrate deploy && npm run start"
   ```

---

## 🎯 Deployment Checklist

### Frontend-Only (Current Setup)
- [x] Node.js 20 configured
- [x] Vite in devDependencies
- [x] Build command: `npm run build`
- [x] Start command: `npm run start`
- [x] Environment variables set in Railway
- [x] `.env` in .gitignore
- [x] Railway PostgreSQL provisioned

### Backend Setup (Future)
- [ ] Create `/server` directory
- [ ] Set up Express/Fastify server
- [ ] Install Prisma and create schema
- [ ] Create API routes
- [ ] Add JWT authentication middleware
- [ ] Add Stripe payment webhooks
- [ ] Add CORS configuration
- [ ] Update Railway start command for backend

---

## 🚨 Troubleshooting

### Build Fails with "vite: not found"
**Solution**: Ensure `vite` is in `devDependencies` and `.npmrc` has `include=dev`

### Database Connection Fails
**Solution**: Check `DATABASE_URL` in Railway dashboard matches the PostgreSQL connection string

### App doesn't start on Railway
**Solution**: Check logs for PORT binding - Railway auto-assigns PORT, ensure start script uses `${PORT:-3000}`

### CORS Errors in Production
**Solution**: Set `CORS_ORIGIN` to your actual domain in Railway variables

---

## 📊 Current Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router
- React Query

**Deployment:**
- Railway (Frontend + Database)
- PostgreSQL 15

**Future Backend:**
- Node.js + Express/Fastify
- Prisma ORM
- JWT Authentication
- Stripe Payments

---

## 🔐 Security Notes

1. **Never commit `.env` file** - Already in .gitignore ✅
2. **Rotate secrets** if accidentally exposed
3. **Use different secrets** for development vs production
4. **Enable SSL** for database connections in production
5. **Set up Railway IP whitelist** if needed

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- Project Issues: Create an issue in the repo

---

**Last Updated**: 2026-01-10
**Railway Project**: Transfer Traders Platform
**Environment**: Production Ready (Frontend)
