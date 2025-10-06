#!/bin/bash

echo "🧪 Testing SkillSwap Backend API"
echo "================================"
echo ""

# Test 1: Health check (if it exists)
echo "📍 Test 1: Health check"
curl -s http://localhost:4000/health || echo "❌ Health endpoint not found"
echo ""
echo ""

# Test 2: Get workshops (public endpoint)
echo "📍 Test 2: Get Workshops (Public)"
echo "GET /api/workshops"
WORKSHOPS=$(curl -s http://localhost:4000/api/workshops)
WORKSHOP_COUNT=$(echo $WORKSHOPS | jq 'length')
echo "✅ Found $WORKSHOP_COUNT workshops"
echo "First workshop:"
echo $WORKSHOPS | jq '.[0] | {title, facilitator: .facilitator.name, date, location}'
echo ""
echo ""

# Test 3: Get user profile (requires authentication)
echo "📍 Test 3: Get User Profile (Protected - needs JWT)"
echo "GET /api/users/profile"
echo "Without token:"
curl -s http://localhost:4000/api/users/profile | jq '.'
echo ""
echo ""

# Test 4: Check auth endpoint
echo "📍 Test 4: Auth endpoint"
echo "GET /api/auth/me"
curl -s http://localhost:4000/api/auth/me | jq '.'
echo ""
echo ""

echo "================================"
echo "✅ Backend is running on http://localhost:4000"
echo ""
echo "To test with Supabase authentication:"
echo "1. Sign in through the frontend"
echo "2. The frontend will send the Supabase JWT token"
echo "3. Backend will verify it with Supabase"
echo ""
echo "Current database has:"
echo "  - Alice Johnson (alice@example.com)"
echo "  - Bob Smith (bob@example.com)"
echo "  - 2 workshops"

