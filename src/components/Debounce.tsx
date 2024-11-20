import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import ExampleTheme from "../themes/exampleTheme";
import {
  $createListItemNode,
  $createListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SharedHistoryContext } from "../context/SharedHistoryContext";
import { ToolbarContext } from "../context/ToolbarContext";
import { SharedAutocompleteContext } from "../context/SharedAutocompleteContext";
import ToolbarPlugin from "../plugins/ToolbarPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FaListCheck, FaStrikethrough } from "react-icons/fa6";
import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";

function Debounce() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        const range = selection.getRangeAt(0);

        let { top, left } = range.getBoundingClientRect();

        console.log("Top ---> ", top, " left ---> ", left);

        console.log("Top ---> ", top, " left ---> ", left);

        const testEle = document.getElementsByClassName("popup")[0];

        if (testEle instanceof HTMLElement) {
          testEle.style.position = "fixed"; 
          testEle.style.transform = `translate(${left}px, ${top}px)`;
        }
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [floatingAnchorElem]);

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
    ],
  };

  function MyCustomList(): JSX.Element {
    const [editor] = useLexicalComposerContext();

    const handleFormatText = (
      format: "bold" | "italic" | "underline" | "strikethrough"
    ) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    return (
      <div className="absolute right-40 top-0 flex flex-row gap-2">
        <button
          onClick={() => handleFormatText("bold")}
          className="rounded-md bg-violet-400 w-8 h-8 hover:scale-105"
        >
          <FaBold className="ml-auto mr-auto text-gray-100" />
        </button>
        <button
          onClick={() => handleFormatText("italic")}
          className="rounded-md bg-violet-400 w-8 h-8 hover:scale-105"
        >
          <FaItalic className="ml-auto mr-auto text-gray-100" />
        </button>
        <button
          onClick={() => handleFormatText("underline")}
          className="rounded-md bg-violet-400 w-8 h-8 hover:scale-105"
        >
          <FaUnderline className="ml-auto mr-auto text-gray-100" />
        </button>
        <button
          onClick={() => handleFormatText("strikethrough")}
          className="rounded-md bg-violet-400 w-8 h-8 hover:scale-105"
        >
          <FaStrikethrough className="ml-auto mr-auto text-gray-100" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-100 h-lvh bg-notearea">
        <LexicalComposer initialConfig={editorConfig}>
          <SharedHistoryContext>
            <SharedAutocompleteContext>
              <ToolbarContext>
                <div className="editor-container h-full w-9/10">
                  <div className="editor-inner mt-2">
                    <RichTextPlugin
                      contentEditable={
                        <div className="editor absolute" ref={onRef}>
                          <ContentEditable className="editor-input mt-10 ml-10 outline-none " />
                          <div
                            className="popup border w-10 h-5 text-gray-100"
                            style={{
                              color: "red",
                              transform: `translate(-10000px, -10000px)`,
                            }}
                          >
                            <p>Test</p>
                          </div>
                        </div>
                      }
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <TabIndentationPlugin />
                    <MyCustomList />
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

export default Debounce;
