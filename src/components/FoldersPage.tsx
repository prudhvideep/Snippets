import { useEffect } from "react";
import {
  RiSearchLine,
  RiAddLine,
  RiFolderOpenLine,
  RiStarLine,
  RiMoreLine,
  RiArrowLeftLine,
  RiFileTextLine,
  RiCloseLine,
} from "react-icons/ri";
import useFileStore from "../store/fileStore";
import { useNavigate } from "react-router-dom";


const FoldersPage = () => {
  const {
    folders,
    files,
    selectedFolder,
    showFolderModal,
    newFolderName,
    fetchFiles,
    setSelectedFolder,
    setSelectedFile,
    setShowFolderModal,
    addFolder,
    setNewFolderName,
    fetchFolders,
  } = useFileStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder.folder_id);
    }
  }, [selectedFolder]);

  function renderFolders() {
    return (
      <div className="mt-8 w-9/10 ml-auto mr-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.folder_id}
            onClick={() => {
              setSelectedFolder(folder);
            }}
            className="bg-notearea rounded-lg border border-gray-500 p-4 hover:border-[#8860a9] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <RiFolderOpenLine className="h-6 w-6 text-[#a474ca]" />
                <h3 className="text-lg font-medium text-white">
                  {folder.folder_name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button className={`text-gray-400 hover:text-[#a474ca]`}>
                  <RiStarLine className="h-5 w-5" />
                </button>
                <button
                  className="text-gray-400 hover:text-[#a474ca]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RiMoreLine className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">{"0 " + "files"}</p>
          </div>
        ))}
      </div>
    );
  }

  const renderFolderContent = () => {
    if (!selectedFolder) return null;

    return (
      <div className="w-9/10 mt-8 ml-auto mr-auto space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedFolder(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <RiArrowLeftLine className="h-5 w-5" />
            Back to Folders
          </button>
          <h2 className="text-xl font-medium text-white">
            {selectedFolder.folder_name}
          </h2>
        </div>

        <button className="flex items-center gap-2 bg-[#6d4d88] text-white px-4 py-2 rounded-lg hover:bg-[#8860a9]">
          <RiAddLine className="h-5 w-5" />
          New File
        </button>

        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.file_id}
              onClick={() => {
                setSelectedFile(file);
                navigate("/note");
              }}
              className="flex items-center justify-between bg-notearea rounded-lg border border-gray-500 p-4 hover:border-[#8860a9] hover:cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <RiFileTextLine className="h-5 w-5 text-gray-400" />
                <span className="text-white">{file.file_name}</span>
              </div>
              <span className="text-sm text-gray-400">
                Edited {file.lastEdited}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sidebar">
      <header className="bg-sidebar border-b border-gray-500">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-row justify-start items-center gap-4 ">
              <h1 className="text-2xl font-semibold text-white">Snippets</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search folders..."
                  className="pl-10 pr-4 py-2 bg-notearea border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8860a9] text-white placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => setShowFolderModal(true)}
                className="flex items-center gap-2 bg-[#6d4d88] text-white px-4 py-2 rounded-lg hover:bg-[#8860a9]"
              >
                <RiAddLine className="h-5 w-5" />
                New Folder
              </button>
            </div>
          </div>
        </div>
      </header>
      {selectedFolder ? renderFolderContent() : renderFolders()}

      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-notearea border border-gray-500 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">
                Create New Folder
              </h2>
              <button
                onClick={() => setShowFolderModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              placeholder="Enter folder name"
              className="w-full bg-sidebar border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8860a9] mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFolderName) {
                    addFolder(newFolderName);
                  }
                  setNewFolderName("");
                  setShowFolderModal(false);
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
};

export default FoldersPage;
