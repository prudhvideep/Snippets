import "./Editor.css";
import { useEffect } from "react";
import { Block } from "@blocknote/core";
import useEditorStore from "@/store/editorStore";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useDebouncedCallback } from "use-debounce";

import useUpdateFileData from "@/hooks/useUpdateFileData";
import Sidebar from "../sidebar/Sidebar";
import { File } from "@/types/types";
import Tab from "../tab/Tab";

export default function Editor() {
  const editor = useCreateBlockNote();
  const { mutate: updateFileData } = useUpdateFileData();
  const { showEditor, selectedFile, openedFiles, sidebarExpanded } =
    useEditorStore();

  useEffect(() => {
    if (!showEditor) return;

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
  }, [selectedFile, showEditor, editor]);

  const debouncedUpdateFile = useDebouncedCallback((fileData: Block[]) => {
    if (selectedFile) {
      updateFileData({
        file_id: selectedFile.file_id,
        file_data: fileData,
      });
    }
  }, 1000);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="editor-container h-full w-full flex flex-row justify-start overflow-hidden">
        <Sidebar />
        <div className="flex flex-col w-full overflow-clip">
          <div className="w-full h-16 shrink-0">
            <div className="editor-tab flex flex-row overflow-auto border-b border-neutral-600 h-full">
              {openedFiles.length > 0 &&
                openedFiles.map((file: File) => (
                  <Tab
                    key={file.file_id}
                    fileId={file.file_id}
                    fileName={file.file_name}
                  />
                ))}
            </div>
          </div>

          {showEditor && (
            <div
              className={`p-2 flex-1 overflow-auto  ${
                sidebarExpanded
                  ? "w-0 md:w-[95%] lg:w-[70%]"
                  : "w-[95%] lg:w-[70%]"
              } ml-auto mr-auto`}
              spellCheck={false}
            >
              <BlockNoteView
                editor={editor}
                onChange={() => {
                  if (selectedFile) debouncedUpdateFile(editor.document);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
