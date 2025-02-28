import { useQuery } from "@tanstack/react-query";
import { Tables } from "../types/database.types";
import useSupabase from "./useSupabase";
import { Folder } from "@/types/types";

function useFoldersQuery() {
  const client = useSupabase();

  return useQuery({
    queryKey: ["folders"],
    queryFn : async () => {
      const { data, error } = await client
        .from("sni_folders")
        .select("*")
        .order("folder_name");

      if (error) {
        console.error("Error fetching folders:", error);
        throw error;
      }

      return data || [];
    },
    staleTime : 60000,
    refetchOnWindowFocus : true
  });
}

export default useFoldersQuery;
