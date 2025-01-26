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
            } else {
                setError('Failed to create playlist');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Something went wrong, please try again later.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Create Playlist</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Playlist Title"
                    className="input text-black"
                />
                <button onClick={handleCreatePlaylist} className="btn">Create Playlist</button>
                {error && <p className="text-red-500">{error}</p>}
                <button onClick={onClose} className="btn-secondary">Cancel</button>
            </div>
        </div>
    );
};

export default CreatePlaylist;
