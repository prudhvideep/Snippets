import { memo, useEffect } from "react";
import {
  RiAddLine,
  RiFolderOpenLine,
  RiStarLine,
  RiCloseLine,
  RiSunLine,
  RiMoonLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import useFileStore from "../store/fileStore";
import useThemeStore from "../store/themeStore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../store/userStore";
import { createFolder, deleteFolder, getFolders } from "../db/neon";
import FolderView from "./FolderView";
import Folder from "../interfaces/Folder";
import { BsTrash } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import SearchIcon from "./Icons/SearchIcon";
import LogoutIcon from "./Icons/LogoutIcon";
import LightIcon from "./Icons/LightIcon";
import DarkIcon from "./Icons/DarkIcon";

const FoldersPage = () => {
  const {
    selectedFolder,
    showFolderModal,
    newFolderName,
    setSelectedFolder,
    setShowFolderModal,
    setNewFolderName,
  } = useFileStore();

  const { uid, setUid } = useUserStore();

  const { theme, setTheme } = useThemeStore();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: folders } = useQuery({
    queryKey: [uid],
    queryFn: async () => {
      if (uid) {
        const folders = await getFolders(uid);

        return folders.map((folder) => ({
          folder_id: folder.folder_id,
          folder_name: folder.folder_name,
        }));
      }

      return null;
    },
    staleTime : 10 * 60 * 1000,
    gcTime : 30 * 60 * 1000,
  });

  const { mutate: delFolder } = useMutation({
    mutationFn: async (folder: Folder) => {
      if (uid) {
        await deleteFolder(folder.folder_id, uid);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [uid] });
    },
  });

  const { mutate: addFol } = useMutation({
    mutationFn: async (folder: Folder) => {
      if (uid) {
        await createFolder(folder, uid);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [uid] });
    },
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      } else {
        navigate("/signup");
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
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
        {folders &&
          folders.map((folder) => (
            <div
              key={folder.folder_id}
              onClick={() => {
                setSelectedFolder(folder);
              }}
              className={`rounded-lg border p-4 hover:border-[#8860a9] transition-colors cursor-pointer ${
                theme === "dark"
                  ? "bg-neutral-800 border-gray-500"
                  : "bg-gray-200 border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <RiFolderOpenLine
                    className={`h-6 w-6 ${
                      theme === "dark" ? "text-neutral-400" : "text-purple-600"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      delFolder(folder);
                    }}
                  >
                    <BsTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  

  const renderFolderContent = () => {
    if (!selectedFolder) return null;

    return <FolderView />;
  };

  return (
    <div
      className={`touch-none min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-100"
      }`}
    >
      <header
        className={`w-full border-b ${
          theme === "dark"
            ? "bg-black border-gray-500"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="mx-auto w-full max-w-8xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full flex justify-center md:justify-between items-center">
            <div className="hidden md:flex flex-row justify-start items-center gap-4 ">
              <h1
                className={`ml-8 text-2xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Snippets
              </h1>
            </div>

            <div className="ml-2 mr-2 lg:mr-8 w-full md:w-auto flex justify-between items-center md:gap-4">
              <div className="relative">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search folders..."
                  className={` pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8860a9] ${
                    theme === "dark"
                      ? "bg-neutral-800 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } ${
                    selectedFolder
                      ? "w-60 sm:w-80 lg:w-full"
                      : "w-40 sm:w-80 lg:w-full"
                  }`}
                />
              </div>
              <div className="flex flex-row gap-1">
                {!selectedFolder && (
                  <button
                    onClick={() => setShowFolderModal(true)}
                    className="flex items-center gap-2 bg-[#6d4d88] text-white px-4 py-2 rounded-lg hover:bg-[#8860a9]"
                  >
                    <RiAddLine className="h-5 w-5" />
                    <p className="hidden sm:block">New Folder</p>
                  </button>
                )}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {theme === "dark" ? (
                    <LightIcon />
                  ) : (
                    <DarkIcon />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {<LogoutIcon />}
                </button>
              </div>
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
                  if (newFolderName && uid) {
                    let newFolder: Folder = {
                      folder_id: uuid(),
                      folder_name: newFolderName,
                    };

                    addFol(newFolder)
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
