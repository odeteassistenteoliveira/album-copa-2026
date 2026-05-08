import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client
export const createBrowserClient = () => createClientComponentClient();

// Server-side Supabase client (service role — apenas em Server Components/API routes)
export const createServerClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
