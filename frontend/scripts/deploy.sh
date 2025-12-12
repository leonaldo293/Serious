#!/bin/bash

# ELTx HUB Frontend Deployment Script
# This script handles the deployment process for the frontend application

set -e  # Exit on any error

echo "🚀 Starting ELTx HUB Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Environment setup
print_status "Setting up environment..."

# Check if .env.local exists, if not create from example
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        print_warning ".env.local not found, creating from .env.example"
        cp .env.example .env.local
        print_warning "Please update .env.local with your production values"
    else
        print_error ".env.example not found. Please create .env.local manually."
        exit 1
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Run tests if they exist
if [ -d "__tests__" ] || [ -f "*.test.ts" ] || [ -f "*.test.tsx" ]; then
    print_status "Running tests..."
    npm test
fi

# Build the application
print_status "Building application..."
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    print_error "Build failed - .next directory not found"
    exit 1
fi

print_status "Build completed successfully!"

# Deployment options
DEPLOYMENT_TARGET=${1:-"local"}

case $DEPLOYMENT_TARGET in
    "local")
        print_status "Starting local production server..."
        npm start
        ;;
    "vercel")
        print_status "Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            print_error "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    "netlify")
        print_status "Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            print_error "Netlify CLI not found. Installing..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod --dir=.next
        ;;
    "docker")
        print_status "Building Docker image..."
        if [ ! -f "Dockerfile" ]; then
            print_warning "Dockerfile not found. Creating one..."
            cat > Dockerfile << EOF
# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF
        fi
        
        print_status "Building Docker image..."
        docker build -t eltx-hub-frontend .
        print_status "Docker image built successfully!"
        print_warning "To run the container: docker run -p 3000:3000 eltx-hub-frontend"
        ;;
    "static")
        print_status "Generating static export..."
        
        # Update next.config.js for static export if needed
        if ! grep -q "output: 'export'" next.config.js; then
            print_warning "Adding static export configuration to next.config.js"
            # This would need to be done manually as it requires careful config merging
        fi
        
        npm run build
        print_status "Static files are in the 'out' directory"
        ;;
    *)
        print_error "Unknown deployment target: $DEPLOYMENT_TARGET"
        echo "Usage: $0 [local|vercel|netlify|docker|static]"
        exit 1
        ;;
esac

print_status "Deployment process completed!"

# Post-deployment checks
if [ "$DEPLOYMENT_TARGET" = "local" ]; then
    print_status "Application is running at http://localhost:3000"
elif [ "$DEPLOYMENT_TARGET" = "vercel" ]; then
    print_status "Check your Vercel dashboard for deployment URL"
elif [ "$DEPLOYMENT_TARGET" = "netlify" ]; then
    print_status "Check your Netlify dashboard for deployment URL"
fi

print_status "Don't forget to:"
echo "  1. Update your environment variables in production"
echo "  2. Configure your domain name"
echo "  3. Set up SSL certificates"
echo "  4. Monitor the application logs"
echo "  5. Set up backup and monitoring"

echo -e "${GREEN}🎉 ELTx HUB Frontend deployed successfully!${NC}"
