import { useState } from "react";
import ExampleTheme from "../themes/exampleTheme";

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
import { FaRegTrashAlt, FaTelegramPlane } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { BsMarkdown } from "react-icons/bs";

function Note() {

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
      <div className="bg-notearea min-h-screen w-full h-screen flex flex-row">
        <LexicalComposer initialConfig={editorConfig}>
          <SharedHistoryContext>
            <SharedAutocompleteContext>
              <ToolbarContext>
                <Sidebar />
                <div className="flex flex-col gap-2 w-full h-full">
                  <div className="mt-3 w-full h-10 mb-2 ml-auto mr-auto">
                    <div className="pl-2 pr-2 w-full h-full flex flex-row justify-between">
                      <div className="w-1/4 h-full overflow-hidden place-content-center">
                        <p className="pl-2 font-medium text-lg text-ellipsis text-[#b8bfc4] hover:text-gray-200 hover:cursor-pointer">
                          Title
                        </p>
                      </div>
                      <div className="w-1/3 h-full overflow-hidden">
                        <div className="w-full h-full flex flex-row justify-end gap-2 items-center">
                          <div className="w-1/5 md:w-1/12 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <MdKeyboardVoice className="text-lg text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-1/5 md:w-1/12 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <FiLock className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-1/5 md:w-1/12 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <FaRegTrashAlt className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-1/5 md:w-1/12 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <FaTelegramPlane className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                          <div className="w-1/5 md:w-1/12 h-8/10 rounded-lg flex items-center justify-center place-content-evenly bg-sidebar">
                            <BsMarkdown className="text-md font-semibold text-gray-200 hover:cursor-pointer hover:scale-105 hover:text-gray-50" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 h-full bg-notearea flex flex-col items-center space-y-4 justify-start overflow-y-auto transition-all duration-300 ease-in-out">
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
