import "react";
// import axios from "axios";

// eslint-disable-next-line react/prop-types
const ArtistInfo = ({ artists }) => {
    // Domyślnie nie powinna być używana tutaj logika do pobierania danych, skoro dane są przekazywane jako props

    return (
        <div className="flex flex-row items-start">
            {/* eslint-disable-next-line react/prop-types */}
            {artists.map((artist) => (
                <div key={artist.id} className="flex flex-col items-center ml-7">
                    <div className="w-40 h-40">
                        <img
                            src={"https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"}
                            alt={"Artist"}
                            className="w-full h-full object-cover rounded-full shadow-lg"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-white mt-1 hover:underline">{artist.name}</h3>
                </div>
            ))}
        </div>
    );
};

export default ArtistInfo;
