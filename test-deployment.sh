#!/bin/bash

echo "========================================="
echo "Testing Deployment Configuration"
echo "========================================="
echo ""

# Configuration
DOMAIN="aidplug-crm-aid-plug.vercel.app"
SUPABASE_URL="ojxfbxxstafxhqkuuvdk.supabase.co"

echo "1. Testing main page..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Main page loads (HTTP $HTTP_CODE)"
else
  echo "✗ Main page failed (HTTP $HTTP_CODE)"
fi
echo ""

echo "2. Testing asset with proper extension..."
curl -I "https://$DOMAIN/assets/index.js" 2>&1 | grep -E "HTTP|Content-Type"
echo ""

echo "3. Checking if assets return HTML (this is BAD)..."
RESPONSE=$(curl -s "https://$DOMAIN/assets/Dashboard-BJvs2rel.js" | head -c 100)
if [[ $RESPONSE == *"<!DOCTYPE"* ]] || [[ $RESPONSE == *"<html"* ]]; then
  echo "✗ PROBLEM: Asset returns HTML instead of JavaScript!"
  echo "   This means assets are missing or being rewritten."
else
  echo "✓ Asset appears to return proper content"
fi
echo ""

echo "4. Testing Supabase connectivity..."
echo "   (Replace YOUR_ANON_KEY with your actual key)"
echo "   curl -H 'apikey: YOUR_ANON_KEY' https://$SUPABASE_URL/rest/v1/leads?select=id&limit=1"
echo ""

echo "========================================="
echo "Manual checks:"
echo "========================================="
echo "1. Check Vercel deployment logs for build errors"
echo "2. Verify environment variables are set in Vercel"
echo "3. Run: npm run build locally and check dist/ folder"
echo "4. Ensure all files in dist/ are deployed to Vercel"
echo ""
echo "Run this after deployment to verify fixes!"
