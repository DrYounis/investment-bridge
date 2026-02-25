export $(grep -v '^#' .env.local | xargs)

echo "URL: $NEXT_PUBLIC_SUPABASE_URL"


curl -v -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"repro-curl-$(date +%s)@example.com\",
    \"password\": \"Password123!\",
    \"data\": {
        \"full_name\": \"Repro Curl\",
        \"user_type\": \"investor\",
        \"role\": \"investor\",
        \"phone\": \"0588112233\",
        \"commercial_register\": \"7009988776\"
    }
}"
