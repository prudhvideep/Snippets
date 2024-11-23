import { CiSearch } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { IoCreateOutline } from "react-icons/io5";
import useNoteLayoutStore from "../store/noteLayoutStore";
import useFileStore from "../store/fileStore";
import { RiFileTextLine } from "react-icons/ri";

function Sidebar() {
  const sideBarExpanded = useNoteLayoutStore.use.sideBarExpanded();
  const setSideBarExpanded = useNoteLayoutStore.use.setSideBarExpanded();

  const { setSelectedFile, files } = useFileStore();

  return (
    <div
      className={`h-full transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${
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
        <IoCreateOutline
          className={`${
            !sideBarExpanded ? "hidden" : "block"
          } mr-4 text-3xl text-gray-400 hover:cursor-pointer hover:text-gray-300 hover:scale-105`}
        />
      </div>
      <div
        className={`${
          !sideBarExpanded ? "hidden" : "flex"
        } mt-6 w-full h-8 relative items-center`}
      >
        <CiSearch className="absolute left-5 top-2 text-gray-400 text-lg font-bold" />
        <input
          placeholder="Search"
          className="w-9/10 pl-8 pr-2 ml-auto mr-auto h-full rounded-md text-gray-200 bg-notearea outline-none"
        />
      </div>
      <div
        className={`${
          !sideBarExpanded ? "hidden" : "flex"
        } flex-col mt-4 w-full h-8 relative items-start`}
      >
        <p className="ml-4 text-gray-400">Snippets</p>

        <div className="ml-4 mt-4 w-9/10 flex flex-col gap-1">
          {files &&
            files.map((file) => (
              <div className="pl-2 p-2 text-gray-400 rounded-md hover:bg-notearea hover:cursor-pointer">
                <div
                  onClick={() => {
                    setSelectedFile(file)
                  }} 
                  className="flex flex-row gap-2 items-center">
                  <RiFileTextLine className="text-xl"/>
                  <p>{file.file_name}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
