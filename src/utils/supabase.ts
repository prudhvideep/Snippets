import { createClient } from "@supabase/supabase-js";

import type { Database } from "../types/database.types";

let client: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseClient() {
  if (client) {
    return client;
  }

  // assert(import.meta.env.SUPABASE_URL, `Supabase URL was not provided`);
  // assert(import.meta.env.SUPABASE_ANON_KEY, `Supabase Anon key was not provided`);

  client = createClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );
  return client;
}
