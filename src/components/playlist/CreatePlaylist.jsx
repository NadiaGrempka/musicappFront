import { useState } from 'react';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const CreatePlaylist = ({ onClose, onPlaylistCreated }) => {
    const [title, setTitle] = useState('');
    const [songIds] = useState([]);
    const [error, setError] = useState('');

    const userId = localStorage.getItem('userId');

    const handleCreatePlaylist = async () => {
        if (!title) {
            setError('Title is required');
            return;
        }

        try {
            const playlist = {
                userId,
                title,
                songIds,
            };

            const response = await axios.post('http://localhost:8080/playlists', playlist);
            if (response.status === 201) {
                onPlaylistCreated(response.data); // Notify parent about the new playlist
                onClose(); // Close the modal

                // Wymuś przejście do strony home i załaduj ją ponownie
                window.location.replace("/home");
            } else {
                setError('Failed to create playlist');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Something went wrong, please try again later.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/60 backdrop-blur-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-black text-center mb-4">Create Playlist</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Playlist Title"
                    className="w-full p-2 border border-gray-300 text-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleCreatePlaylist}
                    className="w-full bg-indigo-600 text-white p-2 rounded-lg mb-4 hover:bg-indigo-700 transition duration-200"
                >
                    Create Playlist
                </button>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <button
                    onClick={onClose}
                    className="w-full bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition duration-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreatePlaylist;
