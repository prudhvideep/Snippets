import { File } from "../types/types";
import { create } from "zustand";
import createSelectors from "./createSelectors";

interface EditorState {
  sidebarExpanded: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  setSidebarExpanded: (expand: boolean) => void;
}

const useEditorStoreBase = create<EditorState>((set) => ({
  sidebarExpanded: true,
  selectedFile : null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  setSidebarExpanded: (expand: boolean) => set({ sidebarExpanded: expand }),
}));

const useEditorStore = createSelectors(useEditorStoreBase);

export default useEditorStore;
