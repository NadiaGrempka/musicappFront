import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import SongList from "./components/SongList";
import PlaylistGrid from "./components/PlaylistGrid";
import ArtistInfo from "./components/ArtistInfo";
import AlbumList from "./components/AlbumList";
import UserProfile from "./components/UserComponent/UserProfile.jsx";
import Login from "./components/login/LoginForm.jsx";
import UserRegistrationForm from "./components/registration/UserRegistrationForm.jsx";
import {FaUserCircle} from "react-icons/fa";

const Home = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);
    const [albumResults, setAlbumResults] = useState([]);
    const [playlistResults, setPlaylistResults] = useState([]);
    const navigate = useNavigate(); // Dodano nawigację

    const fetchTopSongs = async () => {
        try {
            const response = await axios.get("http://localhost:8080/songs");
            setSearchResults(response.data.slice(0, 3));
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
            setPlaylistResults(response.data.slice(0, 3));
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

    return (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white min-h-screen flex">
            <Sidebar/>
            <div className="flex-1 p-6">
                <SearchBar
                    setSearchResults={setSearchResults}
                    setArtistResults={setArtistResults}
                    setAlbumResults={setAlbumResults}
                    setPlaylistResults={setPlaylistResults}
                />
                <div className="mt-8 space-y-6">
                    <h2 className="text-xl font-bold mb-4">Songs</h2>
                    <SongList songs={searchResults} />
                    <h2 className="text-xl font-bold mb-4">Artists</h2>
                    <ArtistInfo artists={artistResults} />
                    <h2 className="text-xl font-bold mb-4">Albums</h2>
                    <AlbumList albums={albumResults} />
                    <h2 className="text-xl font-bold mt-8 mb-4">Playlists</h2>
                    <PlaylistGrid playlists={playlistResults} />
                </div>
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
