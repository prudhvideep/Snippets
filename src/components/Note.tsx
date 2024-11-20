import { useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import ExampleTheme from "../themes/exampleTheme";

import Editor from "./Editor";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HashtagNode } from '@lexical/hashtag';
import { SharedHistoryContext } from "../context/SharedHistoryContext";
import { SharedAutocompleteContext } from "../context/SharedAutocompleteContext";
import { ToolbarContext } from "../context/ToolbarContext";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

function Note() {
  const [sideBarExapanded, setSideBarExapanded] = useState<boolean>(true);

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
        <div
          className={`h-full transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${
            !sideBarExapanded
              ? "w-12 sm:w-16 md:w-20 bg-darkbg"
              : "w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-sidebar"
          }`}
        >
          <div className="mt-6 ml-6 w-full h-10 items-end justify-start">
            <FiMenu
              onClick={() => {
                setSideBarExapanded((value) => (value === true ? false : true));
              }}
              className="text-3xl text-gray-400 hover:cursor-pointer hover:text-gray-300 hover:scale-105"
            />
          </div>
        </div>
        <div className="flex-1 h-full bg-notearea flex flex-col items-center space-y-4 justify-start overflow-y-auto transition-all duration-300 ease-in-out">
          <LexicalComposer initialConfig={editorConfig}>
            <SharedHistoryContext>
              <SharedAutocompleteContext>
                <ToolbarContext>
                  <Editor />
                </ToolbarContext>
              </SharedAutocompleteContext>
            </SharedHistoryContext>
          </LexicalComposer>
        </div>
      </div>
    </>
  );
}

export default Note;
