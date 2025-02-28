import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { Folder } from "@/types/types";

function useCreateFolderQuery() {
  const client = useSupabase();
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn : async (newFolder : Folder) => {
       await client
      .from("sni_folders")
      .insert(newFolder)
    },
    onSuccess : () => {
      queryClient.invalidateQueries({
        queryKey : ["folders"]
      })
    },
    onError : (error) => {
      console.error("Error inserting a new folder : ",error)
    }
  })
}


export default useCreateFolderQuery;