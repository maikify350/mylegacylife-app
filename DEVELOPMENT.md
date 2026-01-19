# Development Configuration

## Caching Disabled in Development

**Important**: This project has caching **disabled** in development mode to ensure immediate updates when making changes.

### What This Means

- ✅ **Code changes** reflect immediately
- ✅ **Image changes** show up right away (logos, assets)
- ✅ **CSS/styling updates** apply instantly
- ✅ **Database changes** are visible without restart
- ✅ **No need to clear browser cache** during development

### Configuration

This is configured in `next.config.mjs`:

```javascript
const nextConfig = {
  // Disable all caching in development
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      isrMemoryCacheSize: 0, // Disable ISR cache
    },
  }),
  // Disable image optimization cache
  images: {
    unoptimized: true,
  },
}
```

### Production Behavior

**Note**: Caching is **enabled** in production for optimal performance. This configuration only affects development mode.

### If You Still See Caching Issues

1. **Hard Refresh**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. **Clear Browser Cache**: `Ctrl + Shift + Delete` → Clear cached images and files
3. **Restart Dev Server**: Stop and run `npm run dev` again
4. **Delete .next folder**: `Remove-Item -Recurse -Force .next` then restart

### Why This Matters

During development, you need to see changes immediately without:
- Restarting the server
- Clearing browser cache
- Waiting for cache invalidation
- Dealing with stale content

This configuration ensures a smooth development experience where **what you code is what you see**.

---

**Last Updated**: January 2026
