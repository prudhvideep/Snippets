import ExampleTheme from "../themes/exampleTheme";

import "../index.css"
import Editor from "./Editor";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HashtagNode } from "@lexical/hashtag";
import { SharedHistoryContext } from "../context/SharedHistoryContext";
import { SharedAutocompleteContext } from "../context/SharedAutocompleteContext";
import { ToolbarContext } from "../context/ToolbarContext";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import Sidebar from "./Sidebar";
import { MdKeyboardVoice } from "react-icons/md";
import { FaChevronLeft, FaRegTrashAlt, FaTelegramPlane } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { BsMarkdown } from "react-icons/bs";
import useFileStore from "../store/fileStore";
import { useNavigate } from "react-router-dom";

function Note() {
  const navigate = useNavigate();
  const { selectedFile, setSelectedFile } = useFileStore();

  const editorConfig = {
    theme: ExampleTheme,
    namespace: "MyEditor",
    onError(error: any) {
      throw error;
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      HashtagNode,
      HorizontalRuleNode,
    ],
  };

  return (
    <>
      <div className="bg-black min-h-screen w-full h-screen flex flex-row">
        <LexicalComposer initialConfig={editorConfig}>
          <SharedHistoryContext>
            <SharedAutocompleteContext>
              <ToolbarContext>
                <Sidebar />
                <div className="flex flex-col gap-2 w-full h-full">
                  <div className="mt-3 w-full h-10 mb-2 ml-auto mr-auto">
                    <div className="pl-2 pr-2 w-full h-full flex flex-row justify-between">
                      <div className="w-1/2 h-full overflow-hidden place-content-center flex flex-row items-center justify-start pl-2">
                        <FaChevronLeft
                          onClick={() => {
                            setSelectedFile(null);
                            navigate("/");
                          }}
                          className="text-xl text-[#b8bfc4] hover:cursor-pointer hover:text-gray-200 hover:scale-110"
                        />
                        <p className="pl-2 font-medium text-lg text-ellipsis text-[#b8bfc4]">
                          {selectedFile?.file_name || "Title"}
                        </p>
                      </div>
                      <div className="w-1/2 h-full overflow-auto">
                        <div className="w-full h-full flex flex-row justify-end gap-2 items-center">
                          <div className="w-10 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <MdKeyboardVoice className="text-lg text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-10 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <FiLock className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-10 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <FaRegTrashAlt className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-10 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <FaTelegramPlane className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-10 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <BsMarkdown className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="note-class flex-1 h-full bg-black flex flex-col items-center space-y-4 justify-start overflow-y-auto transition-all duration-300 ease-in-out">
                    <Editor />
                  </div>
                </div>
              </ToolbarContext>
            </SharedAutocompleteContext>
          </SharedHistoryContext>
        </LexicalComposer>
      </div>
    </>
  );
}

export default Note;
