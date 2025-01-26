import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const SongDetails = ({ songId }) => {
    const [album, setAlbum] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAlbumInfo = async () => {
            try {
                // Pobranie albumu na podstawie songId
                console.log("przed fetchem, songId: ", songId);
                const albumResponse = await fetch(`http://localhost:8080/albums/info?songId=${songId}`);
                if (!albumResponse.ok) {
                    throw new Error("Failed to fetch album information");
                }
                const albumData = await albumResponse.json();

                // Pobranie linku do okładki albumu
                const coverResponse = await fetch(`http://localhost:8080/albums/${albumData.id}/link`);
                console.log("po fetchu albumu, albumId: ", albumData.id);
                if (!coverResponse.ok) {
                    throw new Error("Failed to fetch album cover link");
                }
                const coverLink = await coverResponse.text();

                // Pobranie szczegółów artysty
                const artistResponse = await fetch(`http://localhost:8080/artists/${albumData.artistId}`);
                if (!artistResponse.ok) {
                    throw new Error("Failed to fetch artist information");
                }
                const artistData = await artistResponse.json();

                // Dodanie szczegółów albumu oraz artysty
                setAlbum({
                    ...albumData,
                    coverLink, // Dodanie linku do zdjęcia okładki
                    releaseYear: albumData.year ? new Date(albumData.year).getFullYear() : "N/A", // Rok wydania
                    artistName: artistData.name, // Nazwa artysty
                    birthday: artistData.birthday, // Rok urodzenia artysty
                    activityPeriod: artistData.activityPeriod, // Rok śmierci artysty
                    country: artistData.country, // Kraj pochodzenia artysty
                });
            } catch (err) {
                setError(err.message || "An error occurred while fetching album details");
            }
        };

        if (songId) {
            fetchAlbumInfo();
        }
    }, [songId]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!album) {
        return <div className="text-gray-500">Loading album details...</div>;
    }

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
            <div className="flex items-center gap-4">
                {album.coverLink ? (
                    <img
                        src={album.coverLink}
                        alt={`Album cover for ${album.title}`}
                        className="w-24 h-24 object-cover rounded-md shadow-md"
                    />
                ) : (
                    <div className="w-24 h-24 bg-gray-700 flex items-center justify-center rounded-md">
                        <span className="text-gray-400">No Cover</span>
                    </div>
                )}
                <div>
                    <p className="font-thin">Album</p>
                    <h3 className="text-lg font-bold text-white">{album.title}</h3>
                    <p className="text-sm text-gray-400">Released: {album.releaseYear || "-"}</p>
                    <p className="text-sm text-gray-400">
                        Artist: {album.artistName || "Unknown Artist"} </p>
                    <p className="text-sm text-gray-400">
                        Activity Period: {album.activityPeriod || "-"}
                    </p>
                    <p className="text-sm text-gray-400">Country: {album.country || "-"}</p>
                </div>
            </div>
        </div>
    );
};

SongDetails.propTypes = {
    songId: PropTypes.string.isRequired,
};

export default SongDetails;
