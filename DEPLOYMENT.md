# Deployment Guide - AI Resume Analyzer

## Overview

The AI Resume Analyzer is built to deploy on **Manus Hosting** with automatic scaling, custom domain support, and built-in analytics.

## Deployment Options

### 1. Manus Autoscale (Recommended)

The application is configured for **Autoscale (serverless)** deployment by default, which provides:

- ✅ Automatic scaling based on traffic
- ✅ Zero-cost when idle (instances scale to 0)
- ✅ Pay-per-request pricing
- ✅ Built-in SSL certificates
- ✅ Custom domain support
- ✅ Automatic backups and monitoring
- ✅ Global CDN for static assets

**Deployment Steps:**

1. **Create a Checkpoint** — In the Manus Management UI, ensure you have a checkpoint saved with all your latest changes

2. **Click Publish** — In the Management UI header, click the "Publish" button (enabled after creating a checkpoint)

3. **Configure Settings** — The deployment wizard will guide you through:
   - Domain configuration (auto-generated `xxx.manus.space` or custom domain)
   - Environment variables validation
   - Database connection verification

4. **Deploy** — Click "Deploy" and wait for the build to complete (typically 2-5 minutes)

5. **Verify** — Once deployed, visit your live URL to verify everything is working

### 2. Custom Domain Setup

To use a custom domain:

1. Go to **Settings → Domains** in the Management UI
2. Click "Add Domain"
3. Either:
   - **Purchase a new domain** through Manus
   - **Connect an existing domain** by updating DNS records
4. Follow the DNS setup instructions
5. Wait for DNS propagation (usually 15-30 minutes)

### 3. Environment Variables

All required environment variables are automatically injected:

```
DATABASE_URL          # MySQL/TiDB connection string
JWT_SECRET            # Session signing secret
VITE_APP_ID           # Manus OAuth application ID
OAUTH_SERVER_URL      # Manus OAuth backend URL
VITE_OAUTH_PORTAL_URL # Manus login portal URL
BUILT_IN_FORGE_API_URL    # Manus API endpoint
BUILT_IN_FORGE_API_KEY    # Manus API authentication key
VITE_FRONTEND_FORGE_API_KEY   # Frontend API key
VITE_FRONTEND_FORGE_API_URL   # Frontend API endpoint
```

**To add or modify secrets:**

1. Go to **Settings → Secrets** in the Management UI
2. Add or update environment variables
3. Save changes
4. The application will automatically restart with new values

## Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All features are working in development (`pnpm dev`)
- [ ] No console errors or warnings
- [ ] Database migrations are applied
- [ ] Environment variables are configured
- [ ] Tests pass (`pnpm test`)
- [ ] Build completes without errors (`pnpm build`)
- [ ] Latest checkpoint is created

## Deployment Workflow

### Step 1: Test Locally

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Step 2: Create Checkpoint

In the Manus Management UI:
1. Navigate to the project
2. Review all changes in the Preview panel
3. Click "Create Checkpoint"
4. Add a descriptive message about what's included

### Step 3: Deploy

1. Click the "Publish" button in the Management UI header
2. Review deployment settings
3. Confirm custom domain (if applicable)
4. Click "Deploy"
5. Wait for deployment to complete

### Step 4: Verify Deployment

1. Visit the deployed URL
2. Test core functionality:
   - Login with Manus OAuth
   - Upload a test resume
   - Submit job description
   - Verify analysis results
   - Check history page
3. Monitor logs in the Management UI Dashboard

## Monitoring & Maintenance

### View Logs

In the Management UI:
1. Go to **Dashboard**
2. Click "View Logs"
3. Filter by date, level, or service

### Monitor Performance

In the Management UI:
1. Go to **Dashboard**
2. View real-time metrics:
   - Request count
   - Response times
   - Error rates
   - Database performance

### Database Backups

- Automatic daily backups are created
- Backups are retained for 30 days
- To restore, contact Manus support

## Scaling Considerations

### Autoscale Limits

- **Default max instances:** 10
- **Request timeout:** 180 seconds
- **Memory per instance:** 512 MB
- **CPU per instance:** 1 vCPU

### When to Upgrade to Reserved

Consider upgrading to **Reserved hosting** if:
- You need guaranteed uptime (no cold starts)
- You have consistent traffic (>100 requests/min)
- You need always-on background jobs
- You need fixed IP addresses

To upgrade, contact Manus support or use the Management UI Settings.

## Rollback Procedure

If deployment has issues:

1. Go to **More Menu (⋯) → Version History**
2. Find the previous stable checkpoint
3. Click "Rollback"
4. Confirm the rollback
5. The application will revert to the previous version

## Troubleshooting

### Build Fails

**Error:** `Build failed: TypeScript errors`

**Solution:**
1. Run `pnpm check` locally to find errors
2. Fix TypeScript issues
3. Create a new checkpoint
4. Try deploying again

### Database Connection Error

**Error:** `Cannot connect to database`

**Solution:**
1. Verify `DATABASE_URL` environment variable
2. Check database credentials in Settings → Secrets
3. Ensure database is accessible from the deployment region
4. Contact Manus support if issue persists

### OAuth Login Not Working

**Error:** `OAuth callback failed`

**Solution:**
1. Verify `VITE_APP_ID` and `OAUTH_SERVER_URL`
2. Check that redirect URL is configured correctly
3. Ensure OAuth app is active in Manus dashboard
4. Clear browser cookies and try again

### Slow Performance

**Causes:**
- Cold start (first request after scaling down)
- Database query optimization needed
- Large file uploads

**Solutions:**
1. Upgrade to Reserved hosting to eliminate cold starts
2. Add database indexes for frequently queried fields
3. Implement file compression for uploads
4. Use CDN for static assets (automatic with Manus)

## Analytics

The application includes built-in analytics:

1. Go to **Dashboard → Analytics**
2. View:
   - Unique visitors
   - Page views
   - Top pages
   - Referrer sources
   - Device/browser information

## Security Best Practices

- ✅ All traffic is encrypted (HTTPS)
- ✅ Environment variables are never exposed
- ✅ Database credentials are secured
- ✅ OAuth tokens are managed securely
- ✅ File uploads are scanned and validated
- ✅ User sessions use secure cookies

## Performance Optimization

### Current Optimizations

- ✅ React 19 with automatic batching
- ✅ Code splitting and lazy loading
- ✅ Database query optimization
- ✅ S3 storage for file caching
- ✅ Tailwind CSS purging
- ✅ Gzip compression

### Recommended Improvements

1. **Add caching headers** for static assets
2. **Implement database connection pooling**
3. **Add Redis caching** for frequently accessed data
4. **Optimize images** before upload
5. **Implement service worker** for offline support

## Cost Estimation (Autoscale)

### Typical Usage

- **Compute:** $0.00002400 per vCPU-second
- **Memory:** $0.0000025 per GB-second
- **Storage:** $0.023 per GB-month
- **Bandwidth:** $0.12 per GB

### Example Monthly Cost

For an app with:
- 1,000 daily active users
- 100 analyses per day
- Average response time: 2 seconds

**Estimated monthly cost:** $10-50

(Costs vary based on actual usage patterns)

## Support & Resources

- **Manus Documentation:** https://docs.manus.im
- **Manus Support:** https://help.manus.im
- **GitHub Issues:** [Your repo URL]
- **Email Support:** support@manus.im

## Deployment Checklist Template

```markdown
# Deployment Checklist - [Date]

## Pre-Deployment
- [ ] All features tested locally
- [ ] No console errors
- [ ] Tests passing
- [ ] Build successful
- [ ] Database migrations applied
- [ ] Environment variables configured

## Deployment
- [ ] Checkpoint created
- [ ] Publish button clicked
- [ ] Deployment completed successfully
- [ ] Custom domain configured (if applicable)

## Post-Deployment
- [ ] Live URL accessible
- [ ] Login flow working
- [ ] Core features tested
- [ ] Analytics showing traffic
- [ ] No errors in logs
- [ ] Performance acceptable

## Notes
[Add any specific notes about this deployment]
```

---

**Happy deploying! 🚀**

For questions or issues, reach out to the Manus team or check the documentation.
