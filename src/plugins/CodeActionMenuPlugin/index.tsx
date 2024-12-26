import "./index.css";
import worker from "./worker?worker";

import {
  $createCodeNode,
  $isCodeNode,
  CodeNode,
  getLanguageFriendlyName,
  normalizeCodeLang,
} from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getAdjacentNode,
  $getNearestNodeFromDOMNode,
  isHTMLElement,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";

import { CopyButton } from "./components/CopyButton";
import { canBePrettier, PrettierButton } from "./components/PrettierButton";
import { useDebounce } from "./utils";
import useNoteLayoutStore from "../../store/noteLayoutStore";
import { FaRegCirclePlay } from "react-icons/fa6";
import { $createResponseNode } from "../../components/Nodes/ResponseNode";

interface Position {
  top: string;
  right: string;
}

function CodeActionMenuContainer({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const [lang, setLang] = useState("");
  const [isShown, setShown] = useState<boolean>(true);
  const { sideBarExpanded } = useNoteLayoutStore();
  const [shouldListenMouseMove, setShouldListenMouseMove] =
    useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    right: "-100000px",
    top: "-100000px",
  });
  const codeSetRef = useRef<Set<string>>(new Set());
  const codeDOMNodeRef = useRef<HTMLElement | null>(null);

  function getCodeDOMNode(): HTMLElement | null {
    return codeDOMNodeRef.current;
  }

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event);
      if (isOutside) {
        setShown(false);
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef.current = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = "";

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || "";
        }
      });

      if (codeNode) {
        const { y, left } = codeDOMNode.getBoundingClientRect();
        setLang(_lang);
        setShown(true);
        setPosition({
          right: `${sideBarExpanded ? left - 200 : left - 50}px`,
          top: `${y}px`,
        });
      }
    },
    50,
    1000
  );

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener("mousemove", debouncedOnMouseMove);

    return () => {
      setShown(false);
      debouncedOnMouseMove.cancel();
      document.removeEventListener("mousemove", debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove]);

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case "created":
                codeSetRef.current.add(key);
                break;

              case "destroyed":
                codeSetRef.current.delete(key);
                break;

              default:
                break;
            }
          }
        });
        setShouldListenMouseMove(codeSetRef.current.size > 0);
      },
      { skipInitialization: false }
    );
  }, [editor]);

  function executeCode() {
    const codeDOMNode = codeDOMNodeRef.current;

    if (!codeDOMNode) {
      console.error("No code block selected.");
      return;
    }

    const code = codeDOMNode.textContent;

    if (!code) {
      console.error("Code block is empty.");
      return;
    }

    const workerUrl = new URL("./worker.js", import.meta.url);
    const myWorker = new Worker(workerUrl);

    myWorker.postMessage(code);

    myWorker.onmessage = (event: any) => {
      console.log("event data ", event.data);

      editor.update(() => {
        const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if (!$isCodeNode(codeNode)) {
          console.error("The selected node is not a CodeNode.");
          return;
        }

        const sibling = codeNode.getNextSibling();

        let responseExists = false;

        if (sibling && sibling.__type === "custom-response") {
          responseExists = true;
        }

        const newNode = $createResponseNode("");
        if (event.data.error) {
          newNode.append($createTextNode(event.data.error + "\n"));
          newNode.append($createTextNode(event.data.logs));
        } else {
          newNode.append($createTextNode(event.data.result));
          if (event.data.logs) {
            event.data.logs.forEach((log: string) => {
              newNode.append($createTextNode(log + "\n"));
            });
          }
        }

        if (responseExists) {
          sibling?.replace(newNode);
          return;
        }

        codeNode.insertAfter(newNode);
      });
    };
  }

  const normalizedLang = normalizeCodeLang(lang);
  const codeFriendlyName = getLanguageFriendlyName(lang);
  return (
    <>
      {isShown ? (
        <div
          className="mr-12 lg:mr-0 code-action-menu-container flex flex-row gap-2"
          style={{ ...position }}
        >
          <div className="hidden lg:block code-highlight-language text-white">
            {codeFriendlyName}
          </div>
          <FaRegCirclePlay
            onClick={executeCode}
            className="text-white text-xl hover:cursor-pointer"
          />
          <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
          {canBePrettier(normalizedLang) ? (
            <PrettierButton
              editor={editor}
              getCodeDOMNode={getCodeDOMNode}
              lang={normalizedLang}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function getMouseInfo(event: MouseEvent): {
  codeDOMNode: HTMLElement | null;
  isOutside: boolean;
} {
  const target = event.target;

  if (target && isHTMLElement(target)) {
    const codeDOMNode = target.closest<HTMLElement>("code.editor-code");

    const isOutside = !(
      codeDOMNode ||
      target.closest<HTMLElement>("div.code-action-menu-container")
    );

    return { codeDOMNode, isOutside };
  } else {
    return { codeDOMNode: null, isOutside: true };
  }
}

export default function CodeActionMenuPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null {
  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} />,
    anchorElem
  );
}
