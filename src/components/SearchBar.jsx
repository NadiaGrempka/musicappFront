import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const SearchBar = ({ setSearchResults, setArtistResults, setAlbumResults, setPlaylistResults }) => {
    const [query, setQuery] = useState(""); // Pole do wyszukiwania

    const handleSearch = async () => {
        try {
            const [songsResponse, artistsResponse, albumsResponse, playlistsResponse] = await Promise.all([
                axios.get("http://localhost:8080/search/songs", { params: { title: query || null } }),
                axios.get("http://localhost:8080/search/artists", { params: { name: query || null } }),
                axios.get("http://localhost:8080/search/albums", { params: { title: query || null } }),
                axios.get("http://localhost:8080/search/playlists", { params: { title: query || null } })
            ]);

            console.log("Songs Response:", songsResponse.data);
            console.log("Artists Response:", artistsResponse.data);
            console.log("Albums Response:", albumsResponse.data);
            console.log("Playlists Response:", playlistsResponse.data);

            setSearchResults(songsResponse.data);
            setArtistResults(artistsResponse.data);
            setAlbumResults(albumsResponse.data);
            setPlaylistResults(playlistsResponse.data);
        } catch (error) {
            console.error("Błąd podczas wyszukiwania:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch(); // Wykonaj wyszukiwanie po naciśnięciu Enter
        }
    };

    return (
        <div className="flex justify-center items-center h-20">
            <div className="w-full max-w-lg relative">
                {/* Ikona po lewej stronie */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <IoSearchOutline className="text-gray-400 text-xl" />
                </div>
                {/* Pole input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search by song title, artist name, album title or playlist title"
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-full pl-12 pr-6 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>
        </div>
    );
};

export default SearchBar;
