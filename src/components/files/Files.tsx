import { File } from "../../types/types";
import { MdDeleteOutline } from "react-icons/md";
import useEditorStore from "@/store/editorStore";
import useFilesQuery from "@/hooks/useFilesQuery";
import { IoDocumentTextOutline } from "react-icons/io5";
import useDeleteFileQuery from "@/hooks/useDeleteFileQuery";

export default function FolderFiles({ folderId }: { folderId: string }) {
  const { openedFiles, setSelectedFile, setOpenedFiles,setShowEditor } = useEditorStore();
  const { mutate: deleteFile } = useDeleteFileQuery();
  const { data: files, isLoading, error } = useFilesQuery(folderId, true);

  if (isLoading) return <p className="pl-8 text-gray-400">Loading files...</p>;
  if (error) return <p className="pl-8 text-red-400">Error loading files</p>;

  return (
    <div className="pl-8">
      {files &&
        files.length > 0 &&
        files.map((file: File) => (
          <div
            key={file.file_id}
            onClick={() => {
              setShowEditor(true);
              setSelectedFile(file);
              if (!openedFiles.find((f) => f.file_id === file.file_id)) {
                setOpenedFiles([...openedFiles, file]);
              }
            }}
            className="p-1 flex felx-row gap-2 text-gray-300 items-center truncate rounded-md hover:bg-neutral-700 hover:cursor-pointer "
          >
            <IoDocumentTextOutline />
            <p className="truncate flex-1">{file.file_name}</p>
            <MdDeleteOutline
              onClick={async (e: any) => {
                e.stopPropagation();
                let updatedFiles = openedFiles.filter(
                  (f: File) => f.file_id !== file.file_id
                );
                setOpenedFiles(updatedFiles);
                await deleteFile(file);
              }}
              className="text-lg text-gray-300 hover:text-gray-400 hover:cursor-pointer"
            />
          </div>
        ))}
    </div>
  );
}
