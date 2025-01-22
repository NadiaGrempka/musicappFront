import "react";

function Sidebar() {
    return (
        <div className="w-64 bg-gray-800 p-4 flex-shrink-0">
            <div className="flex items-center fixed space-x-2">
                <div className="bg-gray-600 w-12 h-12 flex items-center justify-center rounded-md">
                    <span className="text-2xl text-white">🎵</span>
                </div>
                <span className="text-xl font-bold pl-6">Your Library</span>
            </div>
        </div>
    );
}

export default Sidebar;
