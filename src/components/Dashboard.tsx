import {
  RiSearchLine,
  RiAddLine,
  RiFolderOpenLine,
  RiStarLine,
  RiFileTextLine,
  RiTimeLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();

  const user = {
    name: "John Doe",
  };

  const folders = [
    { id: 1, name: "Work Notes", filesCount: 23 },
    { id: 2, name: "Personal", filesCount: 15 },
    { id: 3, name: "Projects", filesCount: 8 },
    { id: 4, name: "Meeting Notes", filesCount: 12 },
  ];

  const recentFiles = [
    {
      id: 1,
      name: "Meeting Minutes - Nov 20",
      folder: "Work Notes",
      time: "2 hours ago",
    },
    { id: 2, name: "Project Roadmap", folder: "Projects", time: "5 hours ago" },
    { id: 3, name: "Shopping List", folder: "Personal", time: "Yesterday" },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  return (

    <div className="min-h-screen bg-sidebar">
      <header className="bg-sidebar border-b border-gray-500">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search notes..."
                className="pl-10 pr-4 py-2 bg-notearea border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8860a9] text-white placeholder-gray-400"
              />
            </div>
            <button className="flex items-center gap-2 bg-[#6d4d88] text-white px-4 py-2 rounded-lg hover:bg-[#8860a9]">
              <RiAddLine className="h-5 w-5" />
              New Note
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-notearea rounded-lg border border-gray-500 p-6 mb-6">
          <h2 className="text-xl font-medium text-white">
            Good {getTimeOfDay()}, {user.name}!
          </h2>
          <p className="mt-1 text-gray-400">
            Welcome back to your notes. Here's what's happening today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-notearea rounded-lg border border-gray-500 p-6 min-h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Your Folders</h2>
                <button className="text-[#a474ca] hover:text-[#c599ea] text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between p-3 hover:bg-sidebar rounded-md cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RiFolderOpenLine className="h-5 w-5 text-[#a474ca]" />
                      <div>
                        <p className="font-medium text-white">{folder.name}</p>
                        <p className="text-sm text-gray-400">
                          {folder.filesCount} files
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-300">
                      <RiStarLine className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-notearea rounded-lg border border-gray-500  p-6 min-h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Recent Files</h2>
              </div>
              <div className=" space-y-3 divide-gray-700 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={function handleNavigation() {
                      navigate("/note")
                    }}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-sidebar cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg">
                        <RiFileTextLine className="h-6 w-6 text-[#a474ca]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          in {file.folder}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <RiTimeLine className="h-4 w-4" />
                      <span className="text-sm">{file.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
