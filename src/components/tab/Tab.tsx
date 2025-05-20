import useSupabase from "@/hooks/useSupabase";
import useEditorStore from "@/store/editorStore";
import { MdClose } from "react-icons/md";
import { File } from "@/types/types";
export default function Tab({ fileId, fileName }: any) {
  const client = useSupabase();
  const { openedFiles, selectedFile, setSelectedFile, setOpenedFiles } =
    useEditorStore();

  async function fetchClickedFile(fileId: string) {
    const { data: file } = await client
      .from("sni_files")
      .select("*")
      .eq("file_id", fileId)
      .single();

    if (file) setSelectedFile(file);
  }

  return (
    <div
      className={`p-2 mt-2 flex max-w-60 flex-row gap-2 items-center justify-between hover:cursor-pointer ${
        selectedFile?.file_id === fileId ? "border-b-2 border-b-indigo-200" : ""
      }`}
      onClick={async () => await fetchClickedFile(fileId)}
    >
      <p className="truncate ml-1 font-medium flex-1">{fileName}</p>
      <MdClose
        onClick={async (e: React.MouseEvent) => {
          e.stopPropagation();

          const curFileIdx = openedFiles.findIndex(
            (f: File) => f.file_id === fileId
          );
          const updatedFiles = openedFiles.filter(
            (f: File) => f.file_id !== fileId
          );

          if (curFileIdx >= 0 && selectedFile?.file_id === fileId) {
            let newFileId;
            if (curFileIdx === 0) {
              newFileId = openedFiles[openedFiles.length - 1].file_id;
            } else {
              newFileId = openedFiles[curFileIdx - 1].file_id;
            }

            await fetchClickedFile(newFileId);
          }

          setOpenedFiles(updatedFiles);
        }}
        className="text-sm text-gray-300 hover:text-gray-400 hover:cursor-pointer"
      />
    </div>
  );
}
