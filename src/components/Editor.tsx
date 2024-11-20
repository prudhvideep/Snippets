import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useEffect, useState } from "react";
import { $createTextNode, $getRoot } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import FloatingTextFormatToolbarPlugin from "../plugins/FloatingTextFormatToolbarPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import ComponentPickerPlugin from "../plugins/ComponentPickerPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import CodeHighlightPlugin from "../plugins/CodeHighlightPlugin";
import CustomHighlightPlugin from "../plugins/CustomHighlightPlugin";

export default function Editor(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    function handleClick(event: any) {
      const target = event.target as HTMLElement;

      const checkbox = target.closest('[role="checkbox"]');

      if (checkbox) {
        const checkedVal = checkbox.getAttribute("aria-checked");
        const newVal = checkedVal === "false" ? "true" : "false";
        checkbox.setAttribute("aria-checked", newVal);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();

      const firstChild = root.getFirstChild();

      if (firstChild) {
        const type = firstChild.__type;
        if (type === "paragraph") {
          const firstChildText = firstChild.getTextContent();

          if (firstChildText.trim() === "") {
            const h1 = $createHeadingNode("h1");
            h1.append($createTextNode(firstChildText));
            firstChild.replace(h1);
          }
        }
      }
    });
  }, [editor]);

  return (
    <div className="editor-container w-9/10">
      <div className="editor-inner mt-2">
        {/* <ToolbarPlugin editor={editor} /> */}
        <RichTextPlugin
          contentEditable={
            <div className="editor" ref={onRef}>
              <ContentEditable className="editor-input outline-none" />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HashtagPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TabIndentationPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <ComponentPickerPlugin />
        <CodeHighlightPlugin />
        <CustomHighlightPlugin />
        {floatingAnchorElem && (
          <FloatingTextFormatToolbarPlugin
            anchorElem={floatingAnchorElem}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        )}
      </div>
    </div>
  );
}
