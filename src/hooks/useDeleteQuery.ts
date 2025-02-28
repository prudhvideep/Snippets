import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { Folder } from "@/types/types";

function useDeleteQuery() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folder: Folder) => {
      await client
        .from("sni_folders")
        .delete()
        .eq("folder_id", folder.folder_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
    },
    onError: (error) => {
      console.error("Error inserting a new folder : ", error);
    },
  });
}

export default useDeleteQuery;
