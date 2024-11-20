import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Dispatch, useCallback, useEffect, useState } from "react";
import {
  REDO_COMMAND,
  UNDO_COMMAND,
  LexicalEditor,
  NodeKey,
  $getRoot,
  $isParagraphNode,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
} from "lexical";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { ImRedo, ImUndo } from "react-icons/im";
import { MdCheckBox, MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";

function ToolbarPlugin({ editor }: { editor: LexicalEditor }) {
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [hasUndo, setHasUndo] = useState(false);
  const [hasRedo, setHasRedo] = useState(false);

  useEffect(() => {
    editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setHasUndo(payload);
        return false;
      },
      1
    );

    editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setHasRedo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
          setIsEditorEmpty(false);
          return;
        }

        if ($isParagraphNode(children[0])) {
          setIsEditorEmpty(children[0].getChildren().length === 0);
        } else {
          setIsEditorEmpty(false);
        }
      });
    });
  }, [editor]);

  const handleUndo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  const handleBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleNumberedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleCheckList = useCallback(() => {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  },[editor])

  return (
    <div className="flex flex-row gap-4 justify-start">
      <button
        disabled={!hasUndo}
        onClick={handleUndo}
        className="disabled:opacity-50"
        aria-label="Undo"
      >
        <ImUndo className="font-extralight text-gray-200 hover:cursor-pointer hover:scale-110" />
      </button>
      <button
        disabled={!hasRedo}
        onClick={handleRedo}
        className="disabled:opacity-50"
        aria-label="Redo"
      >
        <ImRedo className="font-extralight text-gray-200 hover:cursor-pointer hover:scale-110" />
      </button>
      <button
        onClick={handleBulletList}
        className="disabled:opacity-50"
        aria-label="Bullet List"
      >
        <MdFormatListBulleted className="font-extralight text-gray-200 hover:cursor-pointer hover:scale-110" />
      </button>
      <button
        onClick={handleNumberedList}
        className="disabled:opacity-50"
        aria-label="Numbered List"
      >
        <MdFormatListNumbered className="font-extralight text-gray-200 hover:cursor-pointer hover:scale-110" />
      </button>
      <button
        onClick={handleCheckList}
        className="disabled:opacity-50"
        aria-label="Numbered List"
      >
        <MdCheckBox className="font-extralight text-gray-200 hover:cursor-pointer hover:scale-110" />
      </button>
    </div>
  );
}

export default ToolbarPlugin;
