import { useState, useEffect } from "react";
import { IoEllipsisVertical, IoHeartOutline, IoHeart, IoPlay } from "react-icons/io5";
import SongDetails from "./SongDetails.jsx";

// eslint-disable-next-line react/prop-types
const SongList = ({ songs = [], onLibraryChange, onPlay }) => {
    const [menuOpen, setMenuOpen] = useState(null);
    const [favorites, setFavorites] = useState({});
    const [playlists, setPlaylists] = useState([]); // State to store user's playlists
    const [selectedSongId, setSelectedSongId] = useState(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:8080/libraries/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    const songIds = data.songlists.map((song) => song.id);
                    const favoritesMap = songIds.reduce((acc, id) => {
                        acc[id] = true;
                        return acc;
                    }, {});
                    setFavorites(favoritesMap);
                } else {
                    console.error("Failed to fetch library");
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                console.error("Something went wrong, please try again later.");
            }
        };

        fetchFavorites();
    }, [userId]);

    const fetchPlaylists = async () => {
        if (userId) {
            try {
                const response = await fetch(`http://localhost:8080/search/playlists?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPlaylists(data);
                } else {
                    console.error("Failed to fetch playlists");
                }
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [userId]);

    const toggleMenu = (id) => {
        setMenuOpen(menuOpen === id ? null : id);
    };

    const toggleFavorite = async (song) => {
        const isFavorite = !favorites[song.id];

        setFavorites((prev) => ({
            ...prev,
            [song.id]: isFavorite,
        }));

        try {
            const response = await fetch(
                `http://localhost:8080/library?userId=${userId}&songId=${song.id}&addSong=${isFavorite}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (response.ok) {
                onLibraryChange();
            } else {
                console.error("Failed to modify library:", response.statusText);
            }
        } catch (error) {
            console.error("Error modifying library:", error);
        }
    };

    const addToPlaylist = async (playlistId, songId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/playlists/addsong?playlistId=${playlistId}&songId=${songId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                alert("Song successfully added to playlist!");
                fetchPlaylists(); // Opcjonalne: Odśwież playlisty, aby dane były aktualne.
                onLibraryChange();  // Wywołanie funkcji odświeżającej aplikację.
            } else {
                const errorText = await response.text();
                console.error("Failed to add song to playlist:", errorText);
                alert(`Error: ${errorText}`);
            }
        } catch (error) {
            console.error("Error adding song to playlist:", error);
            alert("An error occurred while adding the song to the playlist.");
        }
    };

    const handleSongClick = (songId) => {
        setSelectedSongId(selectedSongId === songId ? null : songId);
    };

    return (
        <div className="space-y-4">
            {songs.map((song) => (
                <div key={song.id} className="flex flex-col items-start p-4 bg-gray-800/90 rounded-lg">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-10 h-10 bg-gray-700 flex items-center justify-center rounded-md cursor-pointer"
                                onClick={() => onPlay(song.id)}
                            >
                                <IoPlay size={20} className="text-white" />
                            </div>
                            <div>
                                <h3
                                    className="text-lg font-bold hover:underline cursor-pointer"
                                    onClick={() => handleSongClick(song.id)}
                                >
                                    {song.title}
                                </h3>
                                <p className="text-sm text-gray-400 hover:underline">
                                    {song.artist?.name || "Nieznany artysta"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => toggleFavorite(song)}
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
                                        {playlists.map((playlist) => (
                                            <button
                                                key={playlist.id}
                                                className="block px-4 py-2 text-sm hover:bg-gray-600 w-full text-left"
                                                onClick={() => {
                                                    addToPlaylist(playlist.id, song.id);
                                                    setMenuOpen(null);
                                                }}
                                            >
                                                Add to {playlist.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {selectedSongId === song.id && <SongDetails songId={song.id} />}
                </div>
            ))}
        </div>
    );
};

export default SongList;
