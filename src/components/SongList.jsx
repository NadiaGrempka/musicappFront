import "react"
import { IoEllipsisVertical, IoHeartOutline, IoHeart, IoPlay } from "react-icons/io5";
import {useState} from "react";

// eslint-disable-next-line react/prop-types
const SongList = ({ songs = [] }) => {
    const [menuOpen, setMenuOpen] = useState(null);
    const [favorites, setFavorites] = useState({});

    const toggleMenu = (id) => {
        setMenuOpen(menuOpen === id ? null : id);
    };

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="space-y-4">
            {songs.map((song) => (
                <div
                    key={song.id}
                    className="flex justify-between items-center p-4 bg-gray-800 rounded-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-700 flex items-center justify-center rounded-md">
                            <IoPlay size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold hover:underline">{song.title}</h3>
                            <p className="text-sm text-gray-400 hover:underline">
                                {song.artist?.name || "Nieznany artysta"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => toggleFavorite(song.id)}
                        >
                            {favorites[song.id] ? <IoHeart size={24} /> : <IoHeartOutline size={24} />}
                        </button>
                        <div className="relative">
                            <button
                                className="text-gray-400 hover:text-white"
                                onClick={() => toggleMenu(song.id)}
                            >
                                <IoEllipsisVertical size={24} />
                            </button>
                            {menuOpen === song.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                                    <button
                                        className="block px-4 py-2 text-sm hover:bg-gray-600 w-full text-left"
                                        onClick={() => {
                                            alert(`Added "${song.title}" to playlist!`);
                                            setMenuOpen(null);
                                        }}
                                    >
                                        Add to playlist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SongList;
