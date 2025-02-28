import useFilesQuery from "@/hooks/useFilesQuery";
import { File } from "../../types/types";
import { IoDocumentTextOutline } from "react-icons/io5";
import useEditorStore from "@/store/editorStore";

export default function FolderFiles({ folderId }: { folderId: string }) {
  const { setSelectedFile } = useEditorStore();
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
            onClick={() => setSelectedFile(file)}
            className="p-1 flex felx-row gap-2 text-gray-300 items-center truncate rounded-md hover:bg-neutral-700 hover:cursor-pointer"
          >
            <IoDocumentTextOutline />
            {file.file_name}
          </div>
        ))}
    </div>
  );
}
