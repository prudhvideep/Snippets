import { $isListItemNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode } from "@lexical/rich-text";
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  LexicalEditor,
  LexicalNode,
  PointType,
  RangeSelection,
} from "lexical";
import { useEffect } from "react";

const PLACEHOLDER_CLASS_NAME = "node-placeholder";

const isHtmlHeadingElement = (el: HTMLElement): el is HTMLHeadingElement => {
  return el instanceof HTMLHeadingElement;
};

function setNodePlaceholderFromSelection(editor: LexicalEditor) {
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    setPlaceholderOnSelection({ selection, editor });
  });
}

function getAllLexicalChildren(editor: LexicalEditor) {
  const childrenKeys = editor
    .getEditorState()
    .read(() => $getRoot().getChildrenKeys());

  return childrenKeys.map((key) => ({
    key: key,
    node: $getNodeByKey(key),
    htmlElement: editor.getElementByKey(key),
  }));
}

export const getNodePlaceholder = (lexicalNode: LexicalNode) => {
  let placeholder = "";
  if ($isHeadingNode(lexicalNode)) {
     const tag = lexicalNode.getTag();
     console.log("Tag ----> ",tag)
     placeholder = 'Heading';
     switch (tag) {
        case 'h1': {
           placeholder += ' 1';
           break;
        }
        case 'h2': {
           placeholder += ' 2';
           break;
        }
        case 'h3': {
           placeholder += ' 3';
           break;
        }
     }
  }
  if ($isParagraphNode(lexicalNode)) {
     placeholder += "Press '/' for command ";
  }
  if($isListItemNode(lexicalNode)){
    placeholder += "Press '/' for command ";
  }
  return placeholder;
};

function setPlaceholderOnSelection({
  selection,
  editor,
}: {
  selection: RangeSelection;
  editor: LexicalEditor;
}) {
  const children = getAllLexicalChildren(editor);

  children.forEach(({ htmlElement }) => {
    if (!htmlElement) {
      return;
    }

    if (isHtmlHeadingElement(htmlElement)) {
      return;
    }

    const classList = htmlElement.classList;

    if (classList.length && classList.contains(PLACEHOLDER_CLASS_NAME)) {
      classList.remove(PLACEHOLDER_CLASS_NAME);
    }
  });

  if (
    children.length === 1 &&
    children[0].htmlElement &&
    !isHtmlHeadingElement(children[0].htmlElement)
  ) {
    return;
  }

  const anchor: PointType = selection.anchor;
  const placeholder = getNodePlaceholder(anchor.getNode());

  if (placeholder) {
    const selectedHtmlElement = editor.getElementByKey(anchor.key);

    selectedHtmlElement?.classList.add(PLACEHOLDER_CLASS_NAME);
    selectedHtmlElement?.setAttribute('data-placeholder', placeholder);
 }
}

export default function () {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setNodePlaceholderFromSelection(editor);
    });
  }, [editor]);

  return null;
}
