import { createClient } from "@supabase/supabase-js";

import type { Database } from "../types/database.types";

let client: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseClient() {
  if (client) {
    return client;
  }

  client = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  return client;
}
