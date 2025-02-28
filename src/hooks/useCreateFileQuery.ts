import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { File } from "@/types/types";

function useCreateFileQuery() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFile: File) => {
      const { data, error } = await client
        .from("sni_files")
        .insert(newFile)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data: File) => {
      queryClient.invalidateQueries({
        queryKey: ["files", data.folder_id],
      });
    },
    onError: (error) => {
      console.error("Error inserting a new folder : ", error);
    },
  });
}

export default useCreateFileQuery;
