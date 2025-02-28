import {
  FaChevronDown,
  FaChevronRight,
  FaRegStar,
  FaSearch,
} from "react-icons/fa";
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

export default function Sidebar() {
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
      className={` sidebar flex flex-col items-center h-full border-r border-neutral-500 transition-all delay-75 duration-300 ease-in-out overflow-auto`}
    >
      <div className="relative mt-4 w-9/10 flex flex-col items-center">
        <input
          placeholder="Search"
          className=" p-2 pl-8 pr-2 rounded-md w-[95%] bg-inherit outline-none hover:bg-neutral-700 placeholder:font-semibold"
        />
        <FaSearch className="absolute left-4 top-3 text-neutral-400" />
      </div>

      <div className="mt-4 flex flex-col w-9/10" draggable>
        <p className="p-2 text-sm text-gray-300 font-medium justify-start rounded-md hover:bg-neutral-700">
          Pinned
        </p>
      </div>

      <div className="mt-4 flex flex-col w-9/10" draggable>
        <p className="p-2 text-sm text-gray-300 font-medium justify-start rounded-md hover:bg-neutral-700">
          Favourites
        </p>
        {folders &&
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
                        <p className="truncate font-normal text-ellipsis overflow-hidden">
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
                          setNewFolderName("");
                          setDisplayNewFolder(false);
                        }
                      }}
                      placeholder="New File"
                      className="p-1 ml-auto mr-4 w-3/4 border rounded-md bg-inherit outline-none placeholder:text-gray-400"
                    />
                  )}
                </div>
              )
          )}
      </div>

      <div className="mt-4 flex flex-col gap-1 w-9/10">
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
                          setNewFolderName("");
                          setDisplayNewFolder(false);
                        }
                      }}
                      placeholder="New File"
                      className="p-1 ml-auto mr-4 w-3/4 border rounded-md bg-inherit outline-none placeholder:text-gray-400"
                    />
                  )}
                </div>
              )
          )}

        {displayNewFolder && (
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
            className="p-1 border rounded-md bg-inherit outline-none placeholder:text-gray-400"
          />
        )}
      </div>
    </div>
  );
}
