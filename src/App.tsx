import Blockquote from "@tiptap/extension-blockquote";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import { useEditor, EditorContent } from "@tiptap/react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const editor = useEditor({
    extensions: [Document, Text, TaskItem, Paragraph, TaskList, Blockquote],
    content: `<p></p>`,
    editorProps: {
      attributes: {
        "data-placeholder": "Start typing or paste content here...",
      },
    },
  });

  useEffect(() => {
    console.log(editor?.storage);
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex justify-center min-h-screen overflow-auto">
      <EditorContent editor={editor} className="editor min-h-full" />
    </div>
  );
}

export default App;
