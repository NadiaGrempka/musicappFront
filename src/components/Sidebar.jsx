import { useEffect, useState } from "react";
import CreatePlaylist from "./playlist/CreatePlaylist";
import {IoAdd, IoPlay} from "react-icons/io5";
import AudioPlayer from "./audio/AudioPlayer";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ refresh, onPlay }) => {
    const [songs, setSongs] = useState([]); // Initialize with empty array
    const [playlists, setPlaylists] = useState([]); // Initialize with empty array
    const [expandedPlaylists, setExpandedPlaylists] = useState({});
    const [playlistSongs, setPlaylistSongs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isCreatePlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
    const [currentSong] = useState(null);

    const userId = localStorage.getItem("userId");

    const fetchSongs = async () => {
        if (userId) {
            try {
                const response = await fetch(`http://localhost:8080/libraries/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSongs(data.songlists || []); // Default to empty array if no songs
                } else {
                    setError("Failed to fetch songs");
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setError("Something went wrong, please try again later.");
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchPlaylists = async () => {
        if (userId) {
            try {
                const response = await fetch(`http://localhost:8080/search/playlists?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPlaylists(data || []); // Default to empty array if no playlists
                } else {
                    setError("Failed to fetch playlists");
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setError("Something went wrong, please try again later.");
            }
        }
    };

    const fetchPlaylistSongs = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:8080/search/playlists?playlistId=${playlistId}`);
            if (response.ok) {
                const [playlist] = await response.json();
                setPlaylistSongs((prev) => ({ ...prev, [playlistId]: playlist.songs }));
            } else {
                console.error("Failed to fetch playlist songs");
            }
        } catch (error) {
            console.error("Error fetching playlist songs:", error);
        }
    };

    const togglePlaylistExpansion = (playlistId) => {
        setExpandedPlaylists((prev) => ({
            ...prev,
            [playlistId]: !prev[playlistId],
        }));

        if (!playlistSongs[playlistId]) {
            fetchPlaylistSongs(playlistId);
        }
    };

    useEffect(() => {
        fetchSongs();
        fetchPlaylists();
    }, [userId, refresh]);

    const openCreatePlaylistModal = () => {
        setCreatePlaylistModalOpen(true);
    };

    const closeCreatePlaylistModal = () => {
        setCreatePlaylistModalOpen(false);
    };

    const handlePlaylistCreated = (playlist) => {
        setPlaylists((prevPlaylists) => [...prevPlaylists, playlist]);
        console.log("New Playlist Created:", playlist);
    };

    return (
        <div className="w-64 bg-gray-800 p-4 flex-shrink-0">
            <div className="fixed w-60 top-0 p-4 bg-gray-800/85 backdrop-blur-md flex items-center space-x-2 ">
                <div className="bg-gray-600 w-12 h-12 flex items-center justify-center rounded-md">
                    <span className="text-2xl text-white">🎵</span>
                </div>
                <span className="text-xl font-bold pl-6">Your Library</span>
            </div>
            <div className="mt-20 space-y-4">
                {loading && <div className="text-center text-white">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}

                {/* Button to open Create Playlist modal */}
                <button onClick={openCreatePlaylistModal} className="mt-0 w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 flex items-center justify-center">
                    <IoAdd size={24} className="mr-2"/> Create Playlist
                </button>
                {/* Display Songs */}
                <div className="text-white font-bold text-lg">Your Songs</div>
                {songs.length > 0 ? (
                    songs.map((song) => (
                        <div
                            key={song.id}
                            className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md"
                                    onClick={() => onPlay(song.id)}
                                >
                                    <IoPlay size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold hover:underline">{song.title}</h3>
                                    <p className="text-sm text-gray-400 hover:underline">
                                        {song.artist?.name || "Unknown Artist"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No songs available</div>
                )}

                {/* Display Playlists */}
                <div className="text-white font-bold text-lg mt-6">Your Playlists</div>
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <div key={playlist.id}>
                            <div
                                className="flex justify-between items-center p-4 bg-gray-700 rounded-lg cursor-pointer"
                                onClick={() => togglePlaylistExpansion(playlist.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md">
                                        <span className="text-white font-bold">
                                            {playlist.title[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold hover:underline">{playlist.title}</h3>
                                        <p className="text-sm text-gray-400 hover:underline">
                                            Created by: {playlist.user?.userName || "Unknown"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {expandedPlaylists[playlist.id] && (
                                <div className="pl-6 mt-2 space-y-2">
                                    {playlistSongs[playlist.id] ? (
                                        playlistSongs[playlist.id].map((song) => (
                                            <div
                                                key={song.id}
                                                className="flex p-2 bg-gray-600 rounded-lg"
                                            >
                                                <div
                                                    className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md cursor-pointer"
                                                    onClick={() => onPlay(song.id)}
                                                >
                                                    <IoPlay size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">{song.title}</h4>
                                                    <p className="text-xs text-gray-300">{song.artist?.name || "Unknown Artist"}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-400">Loading songs...</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No playlists available</div>
                )}
            </div>

            {/* AudioPlayer for playing songs */}
            {currentSong && <AudioPlayer song={currentSong} />}

            {isCreatePlaylistModalOpen && (
                <CreatePlaylist
                    onClose={closeCreatePlaylistModal}
                    onPlaylistCreated={handlePlaylistCreated}
                />
            )}
        </div>
    );
};

export default Sidebar;
