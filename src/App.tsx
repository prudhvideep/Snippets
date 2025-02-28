import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import useEditorStore from "./store/editorStore";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./App.css";
import { useEffect, useState } from "react";
import { Block } from "@blocknote/core";
import Sidebar from "./components/sidebar/Sidebar";

export default function App() {
  const editor = useCreateBlockNote();
  const [blocks, setBlocks] = useState<Block[]>([]);

  const { sidebarExpanded, setSidebarExpanded } = useEditorStore();

  useEffect(() => {
    console.log("content --->", blocks);
  }, [blocks]);

  return (
    <div className="min-h-dvh h-dvh w-full">
      <div className="flex flex-row h-full w-full">
        <Sidebar/>
        <div className=" h-full w-full flex flex-col overflow-hidden">
          <div className="h-[7%]">
            <div className="h-full w-full flex flex-row justify-between border-b border-neutral-500">
              <div className="p-2 flex flex-row justify-start items-center w-1/3 hover:cursor-pointer">
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
              </div>
            </div>
          </div>
          <div className="editor-container h-full w-full place-items-center overflow-auto">
            <div className="p-2 w-[95%] md:w-[70%]">
              <BlockNoteView
                editor={editor}
                onChange={() => {
                  setBlocks(editor.document);
                }}
                editor-note-view="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
