import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import SongList from "./components/song/SongList.jsx";
import PlaylistGrid from "./components/playlist/PlaylistGrid.jsx";
import ArtistInfo from "./components/artist/ArtistInfo.jsx";
import AlbumList from "./components/album/AlbumList.jsx";
import UserProfile from "./components/UserComponent/UserProfile.jsx";
import Login from "./components/login/LoginForm.jsx";
import UserRegistrationForm from "./components/registration/UserRegistrationForm.jsx";
import {FaUserCircle} from "react-icons/fa";
import AudioPlayer from "./components/audio/AudioPlayer.jsx";
//import SongDetails from "./components/SongDetails.jsx";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);
    const [albumResults, setAlbumResults] = useState([]);
    const [playlistResults, setPlaylistResults] = useState([]);
    const navigate = useNavigate();
    const [audioSrc, setAudioSrc] = useState('');
    const [refresh, setRefresh] = useState(false);
    const handleLibraryChange = () => { setRefresh((prev) => !prev); };
    const notify = () => toast.success("Playlist created successfully!");

    // W miejscu, gdzie tworzysz playlistę
    const handleNewPlaylistCreated = () => {
        notify();
    };


    const fetchTopSongs = async () => {
        try {
            const response = await axios.get("http://localhost:8080/songs");
            setSearchResults(response.data.slice(0, 4));
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    const fetchTopArtists = async () => {
        try {
            const response = await axios.get("http://localhost:8080/artists");
            setArtistResults(response.data.slice(0, 3));
        } catch (error) {
            console.error("Error fetching artists:", error);
        }
    };

    const fetchTopAlbums = async () => {
        try {
            const response = await axios.get("http://localhost:8080/albums");
            setAlbumResults(response.data.slice(0, 3));
        } catch (error) {
            console.error("Error fetching albums:", error);
        }
    };

    const fetchTopPlaylists = async () => {
        try {
            const response = await axios.get("http://localhost:8080/playlists");
            setPlaylistResults(response.data.slice(0, 4));
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    useEffect(() => {
        fetchTopSongs();
        fetchTopArtists();
        fetchTopAlbums();
        fetchTopPlaylists();
    }, []);

    const handlePlaySong = async (songId) => {
        try {
            const response = await fetch(`http://localhost:8080/songs/${songId}/link`);
            if (response.ok) {
                const link = await response.text();
                console.log('Song link:', link);
                setAudioSrc(link);
            } else {
                console.error('Failed to fetch song link:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching song link:', error);
        }
    };

    return (
        <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white min-h-screen flex">
            <ToastContainer />
            <Sidebar refresh={refresh} onPlay={handlePlaySong} />
            <div className="flex-1 p-6">
                <SearchBar
                    setSearchResults={setSearchResults}
                    setArtistResults={setArtistResults}
                    setAlbumResults={setAlbumResults}
                    setPlaylistResults={setPlaylistResults}
                />
                <div className="mt-8 space-y-6">
                    <h2 className="text-xl font-bold mb-4">Songs</h2>
                    <SongList onLibraryChange={handleLibraryChange} songs={searchResults} onPlay={handlePlaySong} />
                    <h2 className="text-xl font-bold mb-4">Artists</h2>
                    <ArtistInfo artists={artistResults} />
                    <h2 className="text-xl font-bold mb-4">Albums</h2>
                    <AlbumList albums={albumResults} />
                    <h2 className="text-xl font-bold mt-8 mb-4">Playlists</h2>
                    <PlaylistGrid playlists={playlistResults} onChange={handleNewPlaylistCreated}/>
                </div>
                {audioSrc && <AudioPlayer src={audioSrc}/>}
                {/* Button to navigate to profile */}
                <button
                    onClick={() => navigate("/profile")}
                    className="absolute top-8 right-8 text-gray-500 bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-700 flex items-center justify-center"
                >
                    <FaUserCircle size={32}/>
                </button>
            </div>
        </div>
    );
};

const App = () => {
    // const navigate = useNavigate(); // Globalna nawigacja
    //
    // const handleLogout = () => {
    //     navigate("/login");
    // };

    return (
        <Routes> <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegistrationForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} /> </Routes>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
