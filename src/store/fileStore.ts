import { create } from 'zustand';
import {File} from "../interfaces/File"
import {v4 as uuid} from 'uuid';
import Folder from '../interfaces/Folder';
import createSelectors from './createSelectors';
import { createFile, createFolder, getFiles, getFolders } from '../db/neon';

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
  addFile : (file : File, folder_id : string) => void;
  setSelectedFolder : (folder : Folder | null) => void;
  setSelectedFile : (file : File | null) => void;
  setShowFolderModal : (value : boolean) => void;
  setShowFileModal : (value : boolean) => void;
  setNewFolderName : (value : string | null) => void;
  setNewFileName : (value : string | null) => void;
  fetchFolders : () => void; 
  fetchFiles : (id : string) => void;
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

  setNewFileName : (value) => set({newFileName : value || ""}),

  addFolder : async (folderName) => {
    const { folders } = get(); 

    let newFolder = {
      folder_id : uuid(), 
      folder_name : folderName,
      filesCount : 0 
    }

    set((state) => ({
      folders: [...state.folders, newFolder]
    }));

    await createFolder(newFolder);
  
  },

  addFile : async (file, folder_id) => {
    set((state) => ({
      files: [...state.files, file]
    }));

    await createFile(file,folder_id);
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

  fetchFiles : async (id : string) => {
      const files = await getFiles(id);

      const formattedFiles : File[] = [];

      files.forEach((ele) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
      }).format(new Date(ele.last_updated_date))
        

        let formattedElement = {
          file_id : ele.file_id,
          file_name : ele.file_name,
          lastEdited : formattedDate,
          fileContent : ele.file_content,
        };

        formattedFiles.push(formattedElement);
      })
      
      set({files : formattedFiles});
  },


}));

const useFileStore = createSelectors(useFileStoreBase);

export default useFileStore;