# Fix PWA Issues on Vercel

## Issues Identified

- Service Worker (sw.js) returns HTML instead of JS (MIME type issue + authentication blocking)
- Manifest (site.webmanifest) returns 401 Unauthorized (authentication blocking)

## Steps to Fix

- [x] Update vercel.json with proper headers for PWA files
- [x] Commit changes including sw.js move to public folder
- [x] Deploy to Vercel and test PWA functionality

## Files to Edit

- vercel.json: Add headers and rewrites for sw.js and site.webmanifest

## Summary

Updated vercel.json with:

- Proper Content-Type headers for sw.js (application/javascript) and site.webmanifest (application/manifest+json)
- Service-Worker-Allowed header for sw.js
- Cache-Control headers for static assets
- Updated rewrites to exclude PWA files from SPA routing

Changes committed and pushed to main branch. Vercel should automatically deploy the fixes.
