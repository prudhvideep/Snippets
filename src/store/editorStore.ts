import { create } from "zustand";
import createSelectors from "./createSelectors";

interface EditorState {
  
  sidebarExpanded: boolean;
  setSidebarExpanded: (expand: boolean) => void;
}

const useEditorStoreBase = create<EditorState>((set) => ({
  sidebarExpanded: true,
  setSidebarExpanded: (expand: boolean) => set({ sidebarExpanded: expand }),
}));

const useEditorStore = createSelectors(useEditorStoreBase);

export default useEditorStore;
