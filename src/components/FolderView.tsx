import {
  RiAddLine,
  RiArrowLeftLine,
  RiCloseLine,
  RiFileTextLine,
} from "react-icons/ri";
import useFileStore from "../store/fileStore";
import useThemeStore from "../store/themeStore";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFile, deleteFile, getFiles } from "../db/neon";
import { v4 as uuid } from "uuid";
import { File } from "../interfaces/File";
import useUserStore from "../store/userStore";
import { BsTrash } from "react-icons/bs";


export default function FolderView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();
  const { uid } = useUserStore();
  const {
    newFileName,
    showFileModal,
    selectedFolder,
    setNewFileName,
    setSelectedFolder,
    setShowFileModal,
    setSelectedFile,
  } = useFileStore();

  if (!selectedFolder) return;

  const { data: files } = useQuery({
    enabled : Boolean(selectedFolder && uid),
    queryKey: [selectedFolder.folder_id],
    queryFn: async () => {
      if (selectedFolder && uid) {
        const files = await getFiles(selectedFolder.folder_id, uid);

        return files.map((file) => ({
          file_id: file.file_id,
          file_name: file.file_name,
          lastEdited: new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(file.last_updated_date)),
          fileContent: file.file_content,
        }));
      }
    }
  });

  const { mutate: addFile } = useMutation({
    mutationFn: async (file: File) => {
      if (selectedFolder && uid) {
        await createFile(file, selectedFolder.folder_id, uid);
      }
      return file;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [selectedFolder.folder_id] });
    },
  });

  const { mutate: removeFile } = useMutation({
    mutationFn: async (file: File) => {
      if (uid) {
        await deleteFile(file.file_id, uid);
      }
    },
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : [selectedFolder.folder_id]})
    }
  });

  return (
    <div className="w-9/10 mt-8 ml-auto mr-auto space-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`flex items-center gap-2 ${
              theme === "dark"
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <RiArrowLeftLine className="h-5 w-5" />
            <span className="hidden md:block">Back to Folders</span>
          </button>
          <h2
            className={`text-xl font-medium ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {selectedFolder?.folder_name}
          </h2>
        </div>

        <button
          onClick={() => {
            setShowFileModal(true);
          }}
          className="flex items-center gap-2 bg-[#6d4d88] text-white px-4 py-2 rounded-lg hover:bg-[#8860a9]"
        >
          <RiAddLine className="h-5 w-5" />
          <span className="hidden md:block">New File</span>
        </button>
      </div>

      <div className="space-y-2">
        {files &&
          files.map((file) => (
            <div
              key={file.file_id}
              onClick={() => {
                setSelectedFile(file);
                navigate("/note");
              }}
              className={`flex items-center justify-between rounded-lg border p-4 hover:border-[#8860a9] hover:cursor-pointer transition-colors ${
                theme === "dark"
                  ? "bg-neutral-800 border-gray-500"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <RiFileTextLine
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  {file.file_name}
                </span>
              </div>
              <BsTrash
              onClick={(event : React.MouseEvent) => {
                event.stopPropagation()
                removeFile(file)
              }} 
              className="text-white font-medium text-xl hover:text-gray-400"/>
            </div>
          ))}
      </div>
      {/* File Modal */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className={`border rounded-lg p-6 w-9/10 md:w-full max-w-md ${
              theme === "dark"
                ? "bg-notearea border-gray-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-lg font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Create New File
              </h2>
              <button
                onClick={() => setShowFileModal(false)}
                className={`${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8860a9] mb-4 ${
                theme === "dark"
                  ? "bg-sidebar border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setNewFileName("");
                  setShowFileModal(false);
                }}
                className={`px-4 py-2 border rounded-lg ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedFolder) {
                    let newFile: File = {
                      file_id: uuid(),
                      file_name: newFileName,
                      lastEdited: "",
                      fileContent: null,
                    };

                    addFile(newFile);
                  }
                  setNewFileName("");
                  setShowFileModal(false);
                }}
                className="px-4 py-2 bg-[#6d4d88] text-white rounded-lg hover:bg-[#8860a9]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
