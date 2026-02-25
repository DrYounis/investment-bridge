export $(grep -v '^#' .env.local | xargs)

echo "--- Profiles ---"
curl -s -X GET "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/profiles?select=*&limit=1" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"

echo "\n\n--- Investor Profiles ---"
curl -s -X GET "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/investor_profiles?select=*&limit=1" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"
