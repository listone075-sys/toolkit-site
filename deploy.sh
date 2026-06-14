#!/bin/bash
# One-click deploy: push code to GitHub, then deploy to production server
set -e

echo "=== Pushing to GitHub ==="
git push origin main

echo ""
echo "=== Deploying to production ==="
ssh 香港01 "/opt/toolkit_site/deploy.sh"
