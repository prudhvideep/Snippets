import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { File } from "@/types/types";

function useFoldersQuery(folder_id: string, is_enabled: true) {
  const client = useSupabase();

  return useQuery<File[]>({
    queryKey: ["files", folder_id],
    queryFn: async () => {
      const { data, error } = await client
        .from("sni_files")
        .select("*")
        .eq("folder_id", folder_id)
        .order("file_name");

      if (error) {
        console.error("Error fetching folders:", error);
        throw error;
      }

      return data || [];
    },
    staleTime: 60000,
    enabled: is_enabled,
  });
}

export default useFoldersQuery;
