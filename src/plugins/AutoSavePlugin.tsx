import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import useFileStore from "../store/fileStore";
import { saveStateToDb } from "../db/neon";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";

export default function AutoSavePlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const { selectedFile } = useFileStore();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    function saveState(
      fileId: number,
      state: SerializedEditorState<SerializedLexicalNode>
    ) {
      saveStateToDb(fileId, state);
    }

    const unregisterListener = editor.registerUpdateListener(() => {
      const state = editor.getEditorState().toJSON();

      if (selectedFile) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          saveState(selectedFile.file_id, state);
          timeoutId = null;
        }, 2000);
      }
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unregisterListener();
    };
  }, [editor]);

  return <></>;
}
