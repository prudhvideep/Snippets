import { create } from 'zustand';
import {File} from "../interfaces/File"
import {v4 as uuid} from 'uuid';
import Folder from '../interfaces/Folder';
import createSelectors from './createSelectors';

interface FileStore {
  // State
  folders: Folder[];
  files: File[];
  selectedFolder: Folder | null;
  selectedFile : File | null;
  showFolderModal: boolean;
  showFileModal: boolean;
  newFolderName: string;
  newFileName: string;

  // Actions
  setFolders: (folders: Folder[]) => void;
  setFiles: (files : File[]) => void;
  setSelectedFolder : (folder : Folder | null) => void;
  setSelectedFile : (file : File | null) => void;
  setShowFolderModal : (value : boolean) => void;
  setShowFileModal : (value : boolean) => void;
  setNewFolderName : (value : string | null) => void;
  setNewFileName : (value : string | null) => void;
}

const useFileStoreBase = create<FileStore>((set, get) => ({
  // Initial state
  folders: [],
  files: [],
  selectedFolder: null,
  selectedFile : null,
  showFolderModal: false,
  showFileModal: false,
  newFolderName: "",
  newFileName: "",

  // Actions
  setFolders: (folders) => set({ folders }),
  
  setFiles: (files) => set({files : files}),
  
  setSelectedFolder : (folder) => set({selectedFolder : folder}),

  setSelectedFile : (file) => set({selectedFile : file}),

  setShowFolderModal : (value) => set({showFolderModal : value}),

  setShowFileModal : (value) => set({showFileModal : value}),

  setNewFolderName : (value) => set({newFolderName : value || ""}),

  setNewFileName : (value) => set({newFileName : value || ""})

}));

const useFileStore = createSelectors(useFileStoreBase);

export default useFileStore;