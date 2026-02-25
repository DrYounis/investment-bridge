export $(grep -v '^#' .env.local | xargs)

echo "URL: $NEXT_PUBLIC_SUPABASE_URL"

# Generates random email
EMAIL="repro-min-$(date +%s)@example.com"

echo "Signing up $EMAIL..."


curl -v -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"repro-min-$(date +%s)@example.com\",
    \"password\": \"Password123!\",
    \"data\": {
        \"full_name\": \"Repro Minimal\"
    }
}"
