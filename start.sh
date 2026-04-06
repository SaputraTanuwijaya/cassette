#!/bin/bash

echo ""
echo "CASSETTE — Local Music Player"
echo "---------------------------------"

if command -v bun &> /dev/null; then
  echo "bun detected"
  bun install
  echo "Starting dev server at http://localhost:5173"
  start http://localhost:5173
  bun run dev
elif command -v npm &> /dev/null; then
  echo "npm detected (bun not found)"
  npm install
  echo "Starting dev server at http://localhost:5173"
  start http://localhost:5173
  npm run dev
else
  echo "Neither bun nor npm found. Please install Node.js first."
  echo "https://nodejs.org"
  exit 1
fi
