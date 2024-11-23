import { create } from 'zustand';
import {File} from "../interfaces/File"
import Folder from '../interfaces/Folder';
import createSelectors from './createSelectors';
import { getFiles, getFolders } from '../db/neon';

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
  addFolder : (folderName : string) => void;
  setSelectedFolder : (folder : Folder | null) => void;
  setSelectedFile : (file : File | null) => void;
  setShowFolderModal : (value : boolean) => void
  setNewFolderName : (value : string | null) => void;
  fetchFolders : () => void; 
  fetchFiles : (id : number) => void;
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

  setNewFolderName : (value) => set({newFolderName : value || ""}),

  addFolder : (folderName) => {
    const { folders } = get(); 

    let newFolder = {
      folder_id : folders.length > 0 ? folders[folders.length - 1].folder_id + 1 : 1, 
      folder_name : folderName,
      filesCount : 0 
    }

    set((state) => ({
      folders: [...state.folders, newFolder]
    }));
  
  },

  fetchFolders :async () => {
    const folder = await getFolders();
    
    console.log(folder)

    const modifiedFolders : Folder[] = []

    folder.forEach((ele) => {
      let newEle = {
        folder_id: ele.folder_id,
        folder_name : ele.folder_name,
        filesCount : 0
      }


      modifiedFolders.push(newEle);
    })

    set({folders : modifiedFolders})
  },

  fetchFiles : async (id) => {
      const files = await getFiles(id);

      console.log("Files ----> ",files);

      const formattedFiles : File[] = [];

      files.forEach((ele) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
      }).format(new Date(ele.last_edited))

        let formattedElement = {
          file_id : ele.file_id,
          file_name : ele.file_name,
          lastEdited : formattedDate,
        };

        formattedFiles.push(formattedElement);
      })
      
      set({files : formattedFiles});
  },


}));

const useFileStore = createSelectors(useFileStoreBase);

export default useFileStore;