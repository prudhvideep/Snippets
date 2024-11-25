import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TableOfContentsPlugin from "../plugins/TableOfContentsPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useEffect, useState } from "react";
import { $createTextNode, $getRoot } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import FloatingTextFormatToolbarPlugin from "../plugins/FloatingTextFormatToolbarPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import ComponentPickerPlugin from "../plugins/ComponentPickerPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import CodeHighlightPlugin from "../plugins/CodeHighlightPlugin";
import CustomHighlightPlugin from "../plugins/CustomHighlightPlugin";
import AutoSavePlugin from "../plugins/AutoSavePlugin";
import useFileStore from "../store/fileStore";
import { useNavigate } from "react-router-dom";

export default function Editor(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  //isLinkEditMode
  const [_, setIsLinkEditMode] = useState<boolean>(false);

  const { selectedFile } = useFileStore();
  const navigate = useNavigate();

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
    // console.log("Selected file ----> ",selectedFile);

    if (selectedFile) {
      editor.update(() => {
        // console.log("Content ----> ", selectedFile.fileContent);

        if (selectedFile.fileContent) {
          const editorState = editor.parseEditorState(
            JSON.stringify(selectedFile.fileContent)
          );
          editor.setEditorState(editorState);
        }
      });
    }else{
      navigate("/");
    }
  }, [editor, selectedFile]);

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
        <RichTextPlugin
          contentEditable={
            <div className="editor" ref={onRef}>
              <ContentEditable className="editor-input outline-none" />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <HashtagPlugin />
        <HistoryPlugin />
        <CheckListPlugin />
        <AutoFocusPlugin />
        <AutoSavePlugin />
        <TabIndentationPlugin />
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
