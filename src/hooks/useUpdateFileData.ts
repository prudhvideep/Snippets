import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { Block } from "@blocknote/core";

function useUpdateFileData() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file_id,
      file_data,
    }: {
      file_id: string;
      file_data: Block[];
    }) => {
      const { data, error } = await client
        .from("sni_files")
        .update({ file_data: file_data })
        .eq("file_id", file_id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onError: (error) => console.error(error),
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["files", data.folder_id] }),
  });
}

export default useUpdateFileData;
