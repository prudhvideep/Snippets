import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { Folder } from "@/types/types";

function useUpdateFolderExpansion() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folder: Folder) => {
      const { data, error } = await client
        .from("sni_folders")
        .update({ is_expanded: !folder.is_expanded })
        .eq("folder_id", folder.folder_id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export default useUpdateFolderExpansion;
