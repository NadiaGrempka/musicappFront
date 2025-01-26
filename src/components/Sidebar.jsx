import {useEffect, useState} from 'react';
import CreatePlaylist from './playlist/CreatePlaylist';
import {IoPlay} from "react-icons/io5"; // Import the new component

// eslint-disable-next-line react/prop-types
const Sidebar = ({ refresh, onPlay }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreatePlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);

    const userId = localStorage.getItem('userId');

    const fetchSongs = async () => {
        if (userId) {
            try {
                const response = await fetch(`http://localhost:8080/libraries/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSongs(data.songlists);
                } else {
                    setError('Failed to fetch songs');
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setError('Something went wrong, please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchSongs();
    }, [userId, refresh]);

    const openCreatePlaylistModal = () => {
        setCreatePlaylistModalOpen(true);
    };

    const closeCreatePlaylistModal = () => {
        setCreatePlaylistModalOpen(false);
    };

    const handlePlaylistCreated = (playlist) => {
        // Handle the newly created playlist (e.g., update the sidebar or notify the parent)
        console.log('New Playlist Created:', playlist);
    };

    return (
        <div className="w-64 bg-gray-800 p-4 flex-shrink-0">
            <div className="flex items-center fixed space-x-2">
                <div className="bg-gray-600 w-12 h-12 flex items-center justify-center rounded-md">
                    <span className="text-2xl text-white">🎵</span>
                </div>
                <span className="text-xl font-bold pl-6">Your Library</span>
            </div>
            <div className="mt-20 space-y-4">
                {loading && <div className="text-center text-white">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                {songs.map((song) => (
                    <div
                        key={song.id}
                        className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md" onClick={() => onPlay(song.id)}>
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
                ))}
                {/* Button to open Create Playlist modal */}
                <button onClick={openCreatePlaylistModal} className="btn-primary mt-6">
                    Create Playlist
                </button>
            </div>

            {isCreatePlaylistModalOpen && (
                <CreatePlaylist onClose={closeCreatePlaylistModal} onPlaylistCreated={handlePlaylistCreated} />
            )}
        </div>
    );
};

export default Sidebar;
