import "./Editor.css";
import { useEffect } from "react";
import { Block } from "@blocknote/core";
import useFoldersQuery from "@/hooks/useFoldersQuery";
import useEditorStore from "@/store/editorStore";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useDebouncedCallback } from "use-debounce";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";

import useUpdateFileData from "@/hooks/useUpdateFileData";

export default function Editor() {
  const editor = useCreateBlockNote();
  const { data: folders } = useFoldersQuery();
  const { mutate: updateFileData } = useUpdateFileData();
  const { selectedFile, sidebarExpanded, setSidebarExpanded } =
    useEditorStore();

  useEffect(() => {
    if (!selectedFile) {
      editor.replaceBlocks(editor.document, []);
      return;
    }

    try {
      const fileData = selectedFile.file_data as Block[];
      editor.replaceBlocks(editor.document, fileData);
    } catch (error) {
      console.error("Error loading file content:", error);
      editor.replaceBlocks(editor.document, []);
    }
  }, [selectedFile, editor]);

  const debouncedUpdateFile = useDebouncedCallback((fileData: Block[]) => {
    if (selectedFile) {
      updateFileData({
        file_id: selectedFile.file_id,
        file_data: fileData,
      });
    }
  }, 1000);

  return (
    <div className=" h-full w-full flex flex-col overflow-hidden">
      <div className="h-[7%]">
        <div className="h-full w-full flex flex-row justify-between border-b border-neutral-500">
          <div className="p-2 flex flex-row gap-2 justify-start items-center w-1/3 hover:cursor-pointer">
            {sidebarExpanded ? (
              <TbLayoutSidebarLeftCollapse
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="text-3xl font-thin text-neutral-300 hover:text-neutral-400"
              />
            ) : (
              <TbLayoutSidebarRightCollapse
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="text-3xl font-thin text-neutral-300 hover:text-neutral-400"
              />
            )}

            <div className="flex flex-row items-center text-gray-400 text-sm font-medium">
              <div className="flex items-center space-x-1"></div>
              <span className="px-2 py-1 rounded-md hover:bg-neutral-700 transition duration-200 cursor-pointer">
                {folders?.find((f) => f.folder_id === selectedFile?.folder_id)
                  ?.folder_name || "Untitled Folder"}
              </span>
              <span className="text-gray-500">/</span>

              <span className="px-2 py-1 rounded-md hover:bg-neutral-700 transition duration-200 cursor-pointer">
                {selectedFile?.file_name || "Untitled File"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="editor-container h-full w-full place-items-center overflow-auto">
        <div className="p-2 w-[95%] md:w-[70%]">
          <BlockNoteView
            editor={editor}
            onChange={() => {
              if (selectedFile) debouncedUpdateFile(editor.document);
            }}
            editor-note-view="true"
          />
        </div>
      </div>
    </div>
  );
}
