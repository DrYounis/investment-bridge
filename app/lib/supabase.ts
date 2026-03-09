
/**
 * @deprecated Use `import { createClient } from '@/lib/supabase/server'` for server actions
 * or `import { createClient } from '@/lib/supabase/client'` for client components
 * 
 * This file is kept for backward compatibility only.
 */
export { createClient } from '@/lib/supabase/client'

// Legacy named export for backward compatibility
import { createClient as createBrowserClient } from '@/lib/supabase/client'
export const supabase = createBrowserClient()
