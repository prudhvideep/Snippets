import { File } from "../types/types";
import { create } from "zustand";
import createSelectors from "./createSelectors";

interface EditorState {
  sidebarExpanded: boolean;
  selectedFile: File | null;
  openedFiles: File[];
  showEditor: boolean;
  setShowEditor: (status: boolean) => void;
  setOpenedFiles: (files: File[]) => void;
  setSelectedFile: (file: File) => void;
  setSidebarExpanded: (expand: boolean) => void;
}

const useEditorStoreBase = create<EditorState>((set) => ({
  sidebarExpanded: true,
  selectedFile: null,
  openedFiles: [],
  showEditor: false,
  setShowEditor: (status) => set({ showEditor: status }),
  setOpenedFiles: (files) => set({ openedFiles: files }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setSidebarExpanded: (expand: boolean) => set({ sidebarExpanded: expand }),
}));

const useEditorStore = createSelectors(useEditorStoreBase);

export default useEditorStore;
