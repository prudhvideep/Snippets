import {
  FaChevronDown,
  FaChevronRight,
  FaRegStar,
  FaSearch,
} from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import useEditorStore from "@/store/editorStore";
import { Folder } from "@/types/types";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { nanoid } from "nanoid";
import "./Sidebar.css";

export default function Sidebar() {
  const { sidebarExpanded } = useEditorStore();

  const [folders, setFolders] = useState<Folder[]>([]);

  const [newFolderName, setNewFolderName] = useState<string | null>();

  return (
    <div
      className={`${
        sidebarExpanded ? "w-[90%] md:w-[20%]" : "w-0"
      } sidebar flex flex-col items-center h-full border-r border-neutral-500 transition-all delay-75 duration-300 ease-in-out overflow-auto`}
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
        {folders.map(
          (folder: Folder) =>
            folder.isFavourite && (
              <div
                key={folder.folderId}
                onClick={() => {
                  setFolders((prev) =>
                    prev.map((f) =>
                      f.folderId === folder.folderId
                        ? { ...f, isExpanded: !folder.isExpanded }
                        : f
                    )
                  );
                }}
                className="p-2 flex ml-2 pr-2 flex-row justify-between items-center rounded-md hover:bg-neutral-700 hover:cursor-pointer truncate"
              >
                <>
                  <div className="flex flex-row items-center text-gray-300 gap-2">
                    {!folder.isExpanded ? (
                      <FaChevronRight className="text-sm font-normal" />
                    ) : (
                      <FaChevronDown className="text-sm font-normal" />
                    )}
                    <p className="truncate font-normal text-ellipsis overflow-hidden">
                      {folder.folderName}
                    </p>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <MdDeleteOutline
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setFolders((prev) =>
                          prev.filter((f) => f.folderId !== folder.folderId)
                        );
                      }}
                      className="text-lg text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                    />
                    <FaPlus className="text-sm text-gray-300 hover:text-gray-400 hover:cursor-pointer" />
                  </div>
                </>
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
              let newFolder: Folder = {
                folderId: nanoid(10),
                folderName: "",
                isExpanded: false,
                isFavourite: false,
              };
              setFolders((prev) => [...prev, newFolder]);
            }}
            className=" hover:text-gray-400 hover:cursor-pointer"
          />
        </div>

        {folders.map(
          (folder: Folder) =>
            !folder.isFavourite && (
              <div
                key={folder.folderId}
                onClick={() => {
                  setFolders((prev) =>
                    prev.map((f) =>
                      f.folderId === folder.folderId
                        ? { ...f, isExpanded: !folder.isExpanded }
                        : f
                    )
                  );
                }}
                className="p-2 flex ml-2 pr-2 flex-row justify-between items-center rounded-md hover:bg-neutral-700 hover:cursor-pointer truncate"
              >
                {folder.folderName !== "" ? (
                  <>
                    <div className="flex flex-row items-center text-gray-300 gap-2">
                      {!folder.isExpanded ? (
                        <FaChevronRight className="text-sm font-normal" />
                      ) : (
                        <FaChevronDown className="text-sm font-normal" />
                      )}
                      <p className="truncate font-normal text-ellipsis overflow-hidden">
                        {folder.folderName}
                      </p>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                      <FaRegStar
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setFolders((prev) =>
                            prev.map((f) =>
                              f.folderId === folder.folderId
                                ? { ...f, isFavourite: true }
                                : f
                            )
                          );
                        }}
                        className="text-md font-semibold text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                      />
                      <MdDeleteOutline
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setFolders((prev) =>
                            prev.filter((f) => f.folderId !== folder.folderId)
                          );
                        }}
                        className="text-lg text-gray-300 hover:text-gray-400 hover:cursor-pointer"
                      />
                      <FaPlus className="text-sm text-gray-300 hover:text-gray-400 hover:cursor-pointer" />
                    </div>
                  </>
                ) : (
                  <input
                    value={newFolderName || ""}
                    onChange={(e: any) => setNewFolderName(e.target.value)}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        setFolders((prev) =>
                          prev.map((f) =>
                            f.folderId === folder.folderId
                              ? { ...f, folderName: newFolderName || "" }
                              : f
                          )
                        );
                        setNewFolderName(null);
                      }
                    }}
                    placeholder="New Folder"
                    className="p-1 rounded-l-md bg-inherit outline-none placeholder:text-gray-400"
                  />
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}
