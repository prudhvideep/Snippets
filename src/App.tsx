import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "./components/sidebar/Sidebar";
import Editor from "./components/editor/Editor";
import useEditorStore from "@/store/editorStore";

export default function App() {
  const { sidebarExpanded } = useEditorStore();

  return (
    <div className="min-h-dvh h-dvh w-full">
      <PanelGroup direction="horizontal" className="h-full w-full">
        {sidebarExpanded && (
          <>
            <Panel defaultSize={20} minSize={20} maxSize={50}>
              <Sidebar />
            </Panel>
            <PanelResizeHandle className="w-[1px] bg-neutral-700 cursor-col-resize" />
          </>
        )}

        <Panel defaultSize={sidebarExpanded ? 80 : 100} minSize={70}>
          <Editor />
        </Panel>
      </PanelGroup>
    </div>
  );
}
