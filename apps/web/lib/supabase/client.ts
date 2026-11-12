import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { supabaseKey, supabaseUrl } from "./env";

/** Supabase client for client components. The session lives in cookies shared with the server. */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseKey());
}
