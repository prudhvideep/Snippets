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
  RiSunLine,
  RiMoonLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import useFileStore from "../store/fileStore";
import useThemeStore from "../store/themeStore";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { File } from "../interfaces/File";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const FoldersPage = () => {
  const {
    folders,
    files,
    selectedFolder,
    showFolderModal,
    showFileModal,
    newFolderName,
    newFileName,
    fetchFiles,
    setSelectedFolder,
    setSelectedFile,
    setShowFolderModal,
    setShowFileModal,
    addFolder,
    addFile,
    setNewFolderName,
    setNewFileName,
    fetchFolders,
  } = useFileStore();

  const { theme, setTheme } = useThemeStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder.folder_id);
    }
  }, [selectedFolder]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/")        
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  function renderFolders() {
    return (
      <div className="mt-8 w-9/10 ml-auto mr-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.folder_id}
            onClick={() => {
              setSelectedFolder(folder);
            }}
            className={`rounded-lg border p-4 hover:border-[#8860a9] transition-colors cursor-pointer ${
              theme === "dark"
                ? "bg-notearea border-gray-500"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <RiFolderOpenLine
                  className={`h-6 w-6 ${
                    theme === "dark" ? "text-[#a474ca]" : "text-purple-600"
                  }`}
                />
                <h3
                  className={`text-lg font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {folder.folder_name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`${
                    theme === "dark"
                      ? "text-gray-400 hover:text-[#a474ca]"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <RiStarLine className="h-5 w-5" />
                </button>
                <button
                  className={`${
                    theme === "dark"
                      ? "text-gray-400 hover:text-[#a474ca]"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <RiMoreLine className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {"0 " + "files"}
            </p>
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
            className={`flex items-center gap-2 ${
              theme === "dark"
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <RiArrowLeftLine className="h-5 w-5" />
            Back to Folders
          </button>
          <h2
            className={`text-xl font-medium ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {selectedFolder.folder_name}
          </h2>
        </div>

        <button
          onClick={() => {
            setShowFileModal(true);
          }}
          className="flex items-center gap-2 bg-[#6d4d88] text-white px-4 py-2 rounded-lg hover:bg-[#8860a9]"
        >
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
              className={`flex items-center justify-between rounded-lg border p-4 hover:border-[#8860a9] hover:cursor-pointer transition-colors ${
                theme === "dark"
                  ? "bg-notearea border-gray-500"
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
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Edited {file.lastEdited}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`touch-none min-h-screen ${
        theme === "dark" ? "bg-sidebar" : "bg-gray-100"
      }`}
    >
      <header
        className={`w-full border-b ${
          theme === "dark"
            ? "bg-sidebar border-gray-500"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-center md:justify-between items-center">
            <div className="hidden md:flex flex-row justify-start items-center gap-4 ">
              <h1
                className={`text-2xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Snippets
              </h1>
            </div>

            <div className="w-full md:w-auto flex justify-around items-center  md:gap-4">
              <div className="relative">
                <RiSearchLine
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search folders..."
                  className={`w-40 md:w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8860a9] ${
                    theme === "dark"
                      ? "bg-notearea border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
              <button
                onClick={() => setShowFolderModal(true)}
                className="flex items-center gap-2 bg-[#6d4d88] text-white px-4 py-2 rounded-lg hover:bg-[#8860a9]"
              >
                <RiAddLine className="h-5 w-5" />
                <p className="hidden sm:block">New Folder</p>
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {theme === "dark" ? (
                  <RiSunLine className="h-5 w-5" />
                ) : (
                  <RiMoonLine className="h-5 w-5" />
                )}
              </button>
              <button
              onClick={handleLogout}
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              <RiLogoutBoxRLine className="h-5 w-5" />
            </button>
            </div>
          </div>
        </div>
      </header>
      {selectedFolder ? renderFolderContent() : renderFolders()}
      {/* Folder Modal */}
      {showFolderModal && (
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
                Create New Folder
              </h2>
              <button
                onClick={() => setShowFolderModal(false)}
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
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              placeholder="Enter folder name"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8860a9] mb-4 ${
                theme === "dark"
                  ? "bg-sidebar border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFolderModal(false)}
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

                    addFile(newFile, selectedFolder.folder_id);
                    setShowFileModal(false);
                  }
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
