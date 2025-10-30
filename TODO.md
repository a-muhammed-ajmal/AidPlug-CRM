# Fix PWA Issues on Vercel

## Issues Identified

- Service Worker (sw.js) returns HTML instead of JS (MIME type issue + authentication blocking)
- Manifest (site.webmanifest) returns 401 Unauthorized (authentication blocking)

## Steps to Fix

- [ ] Update vercel.json with proper headers for PWA files
- [ ] Commit changes including sw.js move to public folder
- [ ] Deploy to Vercel and test PWA functionality

## Files to Edit

- vercel.json: Add headers and rewrites for sw.js and site.webmanifest
