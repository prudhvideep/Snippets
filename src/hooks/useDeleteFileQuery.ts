import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { File } from "@/types/types";

function useDeleteFileQuery() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      await client.from("sni_files").delete().eq("file_id", file.file_id);

      return file.folder_id;
    },
    onSuccess: (folder_id: string | null) => {
      queryClient.invalidateQueries({
        queryKey: ["files", folder_id],
      });
    },
    onError: (error) => {
      console.error("Error deleting a file : ", error);
    },
  });
}

export default useDeleteFileQuery;
