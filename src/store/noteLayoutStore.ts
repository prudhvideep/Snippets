import {create} from "zustand"
import createSelectors from "./createSelectors"

interface NoteLayoutState {
  sideBarExpanded: boolean;
  setSideBarExpanded : (value : boolean) => void
}

const useNoteLayoutStoreBase = create<NoteLayoutState>((set) => ({
  sideBarExpanded: true,
  setSideBarExpanded: (value : boolean) => {
    set({sideBarExpanded : value})
  },
}));


const useNoteLayoutStore = createSelectors(useNoteLayoutStoreBase);

export default useNoteLayoutStore;