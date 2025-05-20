import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import Editor from "./components/editor/Editor";

export default function App() {
  return (
    <div className="min-h-screen h-screen w-full overflow-hidden">
      <Editor />
    </div>
  );
}
