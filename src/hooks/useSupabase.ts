import { useMemo } from "react";
import { getSupabaseClient } from "../utils/supabase";

function useSupabase() {
  return useMemo(getSupabaseClient, []);
}

export default useSupabase;
