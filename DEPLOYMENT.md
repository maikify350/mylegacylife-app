# Vercel Deployment Guide

## Environment Variables to Add in Vercel

When deploying, you'll need to add these environment variables in the Vercel dashboard:

### Required Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zuklmhukxmycheahxmcr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Service Role (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App URL (Vercel will provide this after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional (for future features)

```bash
# OpenAI (for AI writing assistance)
OPENAI_API_KEY=your_openai_key_here

# Stripe (for billing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
STRIPE_SECRET_KEY=your_stripe_secret_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here

# Google Geocoding
GOOGLE_GEOCODING_API_KEY=your_google_key_here

# n8n
N8N_WEBHOOK_URL=your_n8n_url_here
```

## Deployment Steps

### 1. Import Project
- Go to https://vercel.com/new
- Select "Import Git Repository"
- Choose `maikify350/mylegacylife-app`
- Click "Import"

### 2. Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)

### 3. Add Environment Variables
Click "Environment Variables" and add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Important**: 
- Get your Supabase keys from: https://supabase.com/dashboard/project/zuklmhukxmycheahxmcr/settings/api
- Copy the "anon/public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy the "service_role" key for `SUPABASE_SERVICE_ROLE_KEY`

### 4. Deploy
- Click "Deploy"
- Wait 2-3 minutes for build
- Get your live URL: `https://mylegacylife-app.vercel.app` (or similar)

### 5. Update App URL
After first deploy:
- Go to Settings → Environment Variables
- Add `NEXT_PUBLIC_APP_URL` with your Vercel URL
- Redeploy

## Post-Deployment

### Test Your App
1. Visit your Vercel URL
2. Test homepage loads
3. Go to `/demo` and test voice recorder
4. Go to `/questions` and verify 60 questions load

### Supabase Configuration
Add your Vercel URL to Supabase allowed origins:
1. Go to https://supabase.com/dashboard/project/zuklmhukxmycheahxmcr/settings/api
2. Under "URL Configuration" → "Site URL"
3. Add your Vercel URL
4. Under "Redirect URLs", add: `https://your-app.vercel.app/**`

## Automatic Deployments

Every time you push to GitHub `main` branch, Vercel will automatically:
- Build your app
- Run tests (if configured)
- Deploy to production
- Give you a preview URL

## Custom Domain (Optional)

To use your own domain:
1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `mylegacylife.ai`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure TypeScript has no errors

### Voice Recorder Not Working
- Requires HTTPS (Vercel provides this automatically)
- Check browser console for errors
- Verify microphone permissions

### Questions Page Empty
- Check Supabase connection
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check if 60 questions exist in database

## Performance

Vercel automatically provides:
- ✅ Global CDN
- ✅ Edge caching
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Analytics (on paid plans)

## Monitoring

After deployment, monitor:
- Build times (should be < 2 minutes)
- Page load speed (should be < 2 seconds)
- Error rates (check Vercel dashboard)
- Usage/bandwidth

---

**Your app will be live at**: `https://mylegacylife-app-[random].vercel.app`

Once deployed, share the URL and test all features!
