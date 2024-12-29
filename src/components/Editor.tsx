import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
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
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import CodeActionMenuPlugin from "../plugins/CodeActionMenuPlugin";
import FloatingLinkEditorPlugin from "../plugins/FloatingLinkEditorPlugin";
import { getFileContent } from "../db/neon";
import useUserStore from "../store/userStore";
import { useQuery } from "@tanstack/react-query";

export default function Editor(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const { uid } = useUserStore();
  const { selectedFile } = useFileStore();
  const navigate = useNavigate();

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const {
    data: fileContent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fileContent", selectedFile?.file_id, uid],
    queryFn: async () => {
      if (selectedFile?.file_id && uid) {
        const resp = await getFileContent(selectedFile.file_id, uid);
        return resp[0]?.file_content || null;
      }
      return null;
    },
    enabled: !!selectedFile?.file_id && !!uid,
  });

  useEffect(() => {
    if (fileContent) {
      editor.update(() => {
        const editorState = editor.parseEditorState(
          JSON.stringify(fileContent)
        );
        editor.setEditorState(editorState);
      });
    }
  }, [fileContent, editor]);

  useEffect(() => {
    if (error) {
      navigate("/");
    }
  }, [error]);

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

  useEffect(() => {
    function handleClick(event: MouseEvent) {
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

  if (isLoading) return <div>Loading file...</div>;
  if (error) return <div>Failed to load the file content. Redirecting...</div>;

  return (
    <div className="editor-container w-8/10">
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
        <LinkPlugin />
        <HashtagPlugin />
        <HistoryPlugin />
        <CheckListPlugin />
        <AutoFocusPlugin />
        <AutoSavePlugin />
        <CodeHighlightPlugin />
        <TabIndentationPlugin />
        <ComponentPickerPlugin />
        <CustomHighlightPlugin />
        {floatingAnchorElem && (
          <>
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}
      </div>
    </div>
  );
}
