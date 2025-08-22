# Deluminator Scoreboard - Project Notes

## Deployment Process

### GitHub Actions Workflow
- **File**: `.github/workflows/deploy.yml`
- **Trigger**: Manual workflow dispatch with environment selection (production/preview)
- **Fixed Issues**: Replaced third-party `amondnet/vercel-action` with direct Vercel CLI usage
- **Key Commands**:
  ```bash
  vercel pull --yes --environment=<env> --token=$VERCEL_TOKEN
  vercel build --prod --token=$VERCEL_TOKEN  # for production
  vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN  # for production
  ```

### Environment Secrets
- **Location**: GitHub repository → Settings → Environments → production/preview
- **Required**: `VERCEL_TOKEN` in both production and preview environments
- **Note**: Use environment-specific secrets, not repository secrets

### Database Configuration
- **Issue**: Preview environment may not have DATABASE_URL configured
- **Behavior**: API returns 500 errors but frontend handles gracefully with fallback data
- **Production**: Should have proper database connection via Vercel Postgres integration

## Development Commands

### Local Development
```bash
npm run dev:full    # Run both API (port 3000) and frontend (port 5173)
npm run dev         # Frontend only
npm run dev:api     # API only
```

### Prisma Commands
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open database browser
```

## Project Structure
- **Frontend**: Vue 3 with Composition API + Pinia state management
- **UI**: shadcn/ui components with Tailwind CSS
- **Backend**: Vercel serverless functions with Prisma ORM
- **Database**: PostgreSQL via Vercel Postgres
- **Mock Data**: Local development uses mock Prisma client for offline work
