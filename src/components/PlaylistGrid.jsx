import "react";
import { BsMusicNote } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
function PlaylistGrid({ playlists: propPlaylists }) {
    const [playlists, setPlaylists] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);

    useEffect(() => {
        if (!propPlaylists) {
            // Pobierz playlisty tylko, jeśli nie są przekazywane przez props
            const fetchPlaylists = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/playlists");
                    setPlaylists(response.data);
                } catch (error) {
                    console.error("Błąd podczas pobierania danych:", error);
                }
            };
            fetchPlaylists();
        }
    }, [propPlaylists]);

    const toggleMenu = (id) => {
        setMenuOpen(menuOpen === id ? null : id);
    };

    const playlistsToRender = propPlaylists || playlists;

    return (
        <div className="grid grid-cols-7">
            {playlistsToRender.map((playlist) => (
                <div
                    key={playlist.id}
                    className="bg-gray-800 w-48 h-48 rounded-lg flex flex-col justify-between text-white p-4 relative"
                >
                    {/* Ikona nutki w jasnym tle */}
                    <div className="bg-gray-700 w-20 h-20 flex items-center justify-center rounded-full mx-auto">
                        <BsMusicNote size={30} className="text-gray-300" />
                    </div>
                    {/* Tytuł playlisty */}
                    <h3 className="text-lg font-semibold text-center hover:underline">{playlist.title}</h3>

                    <div className="relative flex items-center">
                        <button
                            className="ml-auto text-gray-400 hover:text-white"
                            onClick={() => toggleMenu(playlist.id)}
                        >
                            <IoEllipsisVertical size={24} />
                        </button>
                        {menuOpen === playlist.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                                <button
                                    className="block px-4 py-2 text-sm hover:bg-gray-600 w-full rounded-lg text-left"
                                    onClick={() => {
                                        alert(`Added "${playlist.title}" to library!`);
                                        setMenuOpen(null);
                                    }}
                                >
                                    Add to library
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PlaylistGrid;
