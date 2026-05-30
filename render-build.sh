#!/usr/bin/env bash
set -o errexit

# 1. Restore Puppeteer cache BEFORE Next.js builds
if [ -d "$XDG_CACHE_HOME/puppeteer" ]; then
  echo "...Restoring Puppeteer Cache from Render Build Cache"
  mkdir -p "$PUPPETEER_CACHE_DIR"
  cp -R "$XDG_CACHE_HOME/puppeteer/." "$PUPPETEER_CACHE_DIR/"
else
  echo "...No global Puppeteer cache found yet"
fi

# 2. Run the Next.js build step
echo "...Starting Next.js build"
next build
# npm run build # uncomment if required

# 3. Save the newly generated/updated cache AFTER a successful build
echo "...Saving Puppeteer Cache to Render Build Cache"
mkdir -p "$XDG_CACHE_HOME/puppeteer"
cp -R "$PUPPETEER_CACHE_DIR/." "$XDG_CACHE_HOME/puppeteer/"
