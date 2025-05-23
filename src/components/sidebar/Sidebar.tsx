import { FaChevronDown, FaChevronRight, FaRegStar } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDeleteOutline } from "react-icons/md";
import { Folder, File } from "@/types/types";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { nanoid } from "nanoid";
import FolderFiles from "../files/Files";
import "./Sidebar.css";
import useCreateFolderQuery from "@/hooks/useCreateFolderQuery";
import useFoldersQuery from "@/hooks/useFoldersQuery";
import useUpdateFolderFavourites from "@/hooks/useUpdateFolderFavourites";
import useDeleteQuery from "@/hooks/useDeleteQuery";
import useUpdateFolderExpansion from "@/hooks/useUpdateFolderExpansion";
import useCreateFileQuery from "@/hooks/useCreateFileQuery";
import useEditorStore from "@/store/editorStore";

export default function Sidebar() {
  const { sidebarExpanded, setSidebarExpanded } = useEditorStore();

  const { mutate: createFolder } = useCreateFolderQuery();
  const { mutate: deleteFolder } = useDeleteQuery();
  const { mutate: updateExpansion } = useUpdateFolderExpansion();
  const { mutate: updateFavourite } = useUpdateFolderFavourites();
  const { mutate: createFile } = useCreateFileQuery();

  const [displayNewFolder, setDisplayNewFolder] = useState(false);
  const [newFileFolderId, setNewFileFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string | null>(null);

  const { data: folders } = useFoldersQuery();

  async function HandleCreateFolder(newFolder: Folder) {
    await createFolder(newFolder);
    setNewFolderName("");
    setDisplayNewFolder(false);
  }

  async function HandleCreateFile(newFile: File) {
    await createFile(newFile);
    setNewFileName("");
    setNewFileFolderId(null);
  }

  return (
    <div
      className={` sidebar flex flex-col items-center h-full ${
        sidebarExpanded
          ? "md:w-1/2 lg:w-[30%] border-r border-neutral-500"
          : "w-[10%] md:w-[5%] lg:w-[4%] border-r border-neutral-500"
      }   transition-all delay-75 duration-300 ease-in-out overflow-auto`}
    >
      {
        <div className={`mt-4 flex flex-col w-9/10 ${sidebarExpanded ? "" : ""}`} draggable>
          <div className="p-2 mb-2">
            {sidebarExpanded ? (
              <GiHamburgerMenu
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="text-2xl font-thin hover:text-neutral-400 hover:cursor-pointer"
              />
            ) : (
              <GiHamburgerMenu
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="text-2xl font-thin  hover:text-neutral-400 hover:cursor-pointer"
              />
            )}
          </div>
          {sidebarExpanded && (
            <p className="p-2 text-sm text-gray-300 font-medium justify-start rounded-md hover:bg-neutral-700">
              Favourites
            </p>
          )}
          {sidebarExpanded &&
            folders &&
            folders.map(
              (folder: Folder) =>
                folder.is_favourite && (
                  <div key={folder.folder_id} className="flex flex-col">
                    <div
                      onClick={async () => {
                        await updateExpansion(folder);
                      }}
                      className="p-2 flex ml-2 pr-2 flex-row justify-between items-center rounded-md hover:bg-neutral-700 hover:cursor-pointer truncate"
                    >
                      <>
                        <div className="flex flex-row items-center text-gray-300 gap-2">
                          {!folder.is_expanded ? (
                            <FaChevronRight className="text-sm font-normal" />
                          ) : (
                            <FaChevronDown className="text-sm font-normal" />
                          )}
                          <p className="truncate font-normal overflow-hidden">
                            {folder.folder_name}
                          </p>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <MdDeleteOutline
                            onClick={async (e: any) => {
                              e.stopPropagation();
                              await deleteFolder(folder);
                            }}
                            className="text-lg text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                          />
                          {folder.is_expanded && (
                            <FaPlus
                              onClick={(e: any) => {
                                e.stopPropagation();
                                setNewFileFolderId(folder.folder_id);
                              }}
                              className="text-sm text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                            />
                          )}
                        </div>
                      </>
                    </div>
                    {folder.is_expanded && (
                      <FolderFiles folderId={folder.folder_id} />
                    )}
                    {folder.folder_id === newFileFolderId && (
                      <div className="pl-6 pr-3 my-1">
                        <div className="flex items-center bg-neutral-800 rounded-md overflow-hidden border border-neutral-700 shadow-md">
                          <input
                            value={newFileName || ""}
                            onChange={(e: any) => setNewFileName(e.target.value)}
                            onKeyDown={async (e: any) => {
                              if (e.key === "Enter") {
                                let newFile: File = {
                                  file_id: nanoid(10),
                                  folder_id: folder.folder_id,
                                  file_name: newFileName || "",
                                  file_data: null,
                                  is_pinned: false,
                                };
                                await HandleCreateFile(newFile);
                              } else if (e.key === "Escape") {
                                setNewFileName("");
                                setNewFileFolderId(null);
                              }
                            }}
                            placeholder="New File"
                            className="p-2 flex-grow bg-transparent outline-none placeholder:text-neutral-500 text-gray-200"
                            autoFocus
                          />
                          <button 
                            onClick={async () => {
                              let newFile: File = {
                                file_id: nanoid(10),
                                folder_id: folder.folder_id,
                                file_name: newFileName || "",
                                file_data: null,
                                is_pinned: false,
                              };
                              await HandleCreateFile(newFile);
                            }}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
            )}
        </div>
      }

      {sidebarExpanded && (
        <div className=" mt-4 flex flex-col gap-1 w-9/10">
          <div
            draggable
            className="p-2 text-sm flex flex-row text-gray-300 font-medium justify-between items-center rounded-md hover:bg-neutral-700 "
          >
            <p className="">Private</p>
            <FaPlus
              onClick={() => {
                setDisplayNewFolder(true);
              }}
              className=" hover:text-gray-400 hover:cursor-pointer"
            />
          </div>

          {folders &&
            folders.map(
              (folder: Folder) =>
                !folder.is_favourite && (
                  <div key={folder.folder_id} className="flex flex-col">
                    <div
                      onClick={async () => {
                        await updateExpansion(folder);
                      }}
                      className="p-2 flex ml-2 pr-2 flex-row justify-between items-center rounded-md hover:bg-neutral-700 hover:cursor-pointer truncate"
                    >
                      {folder.folder_name !== "" && (
                        <>
                          <div className="flex flex-row items-center text-gray-300 gap-2">
                            {!folder.is_expanded ? (
                              <FaChevronRight className="text-sm font-normal" />
                            ) : (
                              <FaChevronDown className="text-sm font-normal" />
                            )}
                            <p className="truncate font-normal text-md text-ellipsis overflow-hidden">
                              {folder.folder_name}
                            </p>
                          </div>
                          <div className="flex flex-row gap-1 items-center">
                            <FaRegStar
                              onClick={async (e: any) => {
                                e.stopPropagation();
                                await updateFavourite(folder);
                              }}
                              className="text-md font-semibold text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                            />
                            <MdDeleteOutline
                              onClick={async (e: any) => {
                                e.stopPropagation();
                                await deleteFolder(folder);
                              }}
                              className="text-lg text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                            />
                            {folder.is_expanded && (
                              <FaPlus
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  setNewFileFolderId(folder.folder_id);
                                }}
                                className="text-sm text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {folder.is_expanded && (
                      <FolderFiles folderId={folder.folder_id} />
                    )}
                    {folder.folder_id === newFileFolderId && (
                      <div className="pl-6 pr-3 my-1">
                        <div className="flex items-center bg-neutral-800 rounded-md overflow-hidden border border-neutral-700 shadow-md">
                          <input
                            value={newFileName || ""}
                            onChange={(e: any) => setNewFileName(e.target.value)}
                            onKeyDown={async (e: any) => {
                              if (e.key === "Enter") {
                                let newFile: File = {
                                  file_id: nanoid(10),
                                  folder_id: folder.folder_id,
                                  file_name: newFileName || "",
                                  file_data: null,
                                  is_pinned: false,
                                };
                                await HandleCreateFile(newFile);
                              } else if (e.key === "Escape") {
                                setNewFileName("");
                                setNewFileFolderId(null);
                              }
                            }}
                            placeholder="New File"
                            className="p-2 flex-grow bg-transparent outline-none placeholder:text-neutral-500 text-gray-200"
                            autoFocus
                          />
                          <button 
                            onClick={async () => {
                              let newFile: File = {
                                file_id: nanoid(10),
                                folder_id: folder.folder_id,
                                file_name: newFileName || "",
                                file_data: null,
                                is_pinned: false,
                              };
                              await HandleCreateFile(newFile);
                            }}
                            className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
            )}

          {displayNewFolder && (
            <div className="ml-4 my-2">
              <div className="flex items-center bg-neutral-800 rounded-md overflow-hidden border border-neutral-700 shadow-md">
                <input
                  value={newFolderName || ""}
                  onChange={(e: any) => setNewFolderName(e.target.value)}
                  onKeyDown={async (e: any) => {
                    if (e.key === "Enter") {
                      let newFolder: Folder = {
                        folder_id: nanoid(10),
                        folder_name: newFolderName || "",
                        is_favourite: false,
                        is_expanded: false,
                      };
                      await HandleCreateFolder(newFolder);
                    } else if (e.key === "Escape") {
                      setNewFolderName("");
                      setDisplayNewFolder(false);
                    }
                  }}
                  placeholder="New Folder"
                  className="p-2 flex-grow bg-transparent outline-none placeholder:text-neutral-500 text-gray-200"
                  autoFocus
                />
                <button 
                  onClick={async () => {
                    let newFolder: Folder = {
                      folder_id: nanoid(10),
                      folder_name: newFolderName || "",
                      is_favourite: false,
                      is_expanded: false,
                    };
                    await HandleCreateFolder(newFolder);
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}