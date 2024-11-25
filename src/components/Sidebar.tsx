import { FiMenu } from "react-icons/fi";
import useNoteLayoutStore from "../store/noteLayoutStore";

function Sidebar() {
  const sideBarExpanded = useNoteLayoutStore.use.sideBarExpanded();
  const setSideBarExpanded = useNoteLayoutStore.use.setSideBarExpanded();

  return (
    <div
      className={`hidden sm:block h-full transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${
        !sideBarExpanded
          ? "w-12 sm:w-16 md:w-20 bg-darkbg"
          : "w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-sidebar"
      }`}
    >
      <div className="flex flex-row mt-2 w-full h-10 items-end justify-between">
        <FiMenu
          onClick={() => {
            setSideBarExpanded(!sideBarExpanded);
          }}
          className="ml-4 text-3xl text-gray-400 hover:cursor-pointer hover:text-gray-300 hover:scale-105"
        />
      </div>
      <div
        className={`${
          !sideBarExpanded ? "hidden" : "flex"
        } flex-col mt-4 w-full h-8 relative items-start`}
      >
        <p className="ml-4 text-gray-400">Snippets</p>
      </div>
    </div>
  );
}

export default Sidebar;
