import {create} from "zustand"
import createSelectors from "./createSelectors"

interface UserState {
  uid : string | null,
  email : string | null,
  showMessage : boolean,
  authError : boolean,
  authErrorMessage : string | null,
  userName : string | null,
  setUid : (uid : string | null) => void;
  setEmail : (email : string | null) => void;
  setAuthError : (error : boolean) => void;
  setShowMessage : (value : boolean) => void;
  setAuthErrorMessage : (errMessage : string | null) => void;
  setUserName : (name : string | null) => void;
}

const useUserStoreBase = create<UserState>((set) => ({
  uid : null,
  email : null,
  showMessage : false,
  authError : false,
  authErrorMessage : null,
  userName : null,
  setUid : (uid) => set({uid : uid}),
  setEmail : (email) => set({email : email}),
  setAuthError : (error) => set({authError : error}),
  setShowMessage : (value) => set({showMessage : value}),
  setAuthErrorMessage : (errMessage) => set({authErrorMessage : errMessage}),
  setUserName : (name) => set({userName : name})
}));


const useUserStore = createSelectors(useUserStoreBase);

export default useUserStore;