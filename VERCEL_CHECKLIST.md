# 🚀 Quick Vercel Deployment Checklist

## Before You Start
- [ ] Vercel account created
- [ ] Email verification code received
- [ ] GitHub repo connected: `maikify350/mylegacylife-app`

## Step 1: Get Supabase Keys
Go to: https://supabase.com/dashboard/project/zuklmhukxmycheahxmcr/settings/api

Copy these values:
```
Project URL: https://zuklmhukxmycheahxmcr.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 2: Import to Vercel
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select: `maikify350/mylegacylife-app`
4. Click "Import"

## Step 3: Add Environment Variables
Click "Environment Variables" and add these 3:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zuklmhukxmycheahxmcr.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (paste your anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | (paste your service_role key) |

## Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Get your URL: `https://mylegacylife-app-xxxxx.vercel.app`

## Step 5: Test
Visit your new URL and test:
- [ ] Homepage loads
- [ ] Click "Try Voice Recording Demo"
- [ ] Click "Start Recording" (allow microphone)
- [ ] Speak and see text appear
- [ ] Visit `/questions` - see all 60 questions

## Step 6: Configure Supabase (Important!)
Go to: https://supabase.com/dashboard/project/zuklmhukxmycheahxmcr/settings/api

Under "URL Configuration":
- Site URL: Add your Vercel URL
- Redirect URLs: Add `https://your-app.vercel.app/**`

## Done! 🎉
Your app is now live on the internet!

Share the URL: `https://mylegacylife-app-xxxxx.vercel.app`

---

## Troubleshooting

**Build fails?**
- Check environment variables are correct
- View build logs in Vercel dashboard

**Voice recorder not working?**
- Must use HTTPS (Vercel provides this)
- Allow microphone permissions
- Use Chrome or Safari

**Questions page empty?**
- Verify Supabase URL is correct
- Check if 60 questions exist in database
- Check browser console for errors

**Need help?**
See full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
