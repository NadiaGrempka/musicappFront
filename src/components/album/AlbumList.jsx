import "react";
import { useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const AlbumList = ({ albums: propAlbums }) => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        if (!propAlbums) {
            // Pobierz albumy tylko, jeśli nie są przekazywane przez props
            const fetchAlbums = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/albums");
                    setAlbums(response.data);
                } catch (error) {
                    console.error("Błąd podczas pobierania danych:", error);
                }
            };
            fetchAlbums();
        }
    }, [propAlbums]);

    const albumsToRender = propAlbums || albums;

    return (
        <div className="flex flex-row items-start">
            {albumsToRender.map((album) => (
                <div key={album.id} className="flex flex-col items-center ml-7">
                    <div className="w-40 h-40">
                        <img
                            src={
                                album.imageUrl ||
                                "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                            }
                            alt={"Album"}
                            className="w-full h-full object-cover rounded-md shadow-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-white mt-1 hover:underline">{album.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default AlbumList;
