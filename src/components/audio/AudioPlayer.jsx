import { useState, useRef, useEffect } from "react";
import { IoPlay, IoPause, IoVolumeHigh, IoEllipsisVertical, IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
const AudioPlayer = ({ src, onPrevious, onNext }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    useEffect(() => {
        if (src) {
            audioRef.current.src = src; // Update the audio source
            audioRef.current.play(); // Automatically play the new song
            setIsPlaying(true);
        }
    }, [src]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 flex items-center justify-between shadow-lg rounded-lg w-[90%] max-w-2xl">
            {/* Previous Button */}
            <button
                onClick={onPrevious}
                className="text-white bg-gray-900 p-3 rounded-full hover:bg-gray-700 transition-all duration-200"
            >
                <IoPlaySkipBack size={20} />
            </button>

            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                className="text-white bg-gray-900 p-3 rounded-full hover:bg-gray-700 transition-all duration-200 mx-2"
            >
                {isPlaying ? <IoPause size={20} /> : <IoPlay size={20} />}
            </button>

            {/* Next Button */}
            <button
                onClick={onNext}
                className="text-white bg-gray-900 p-3 rounded-full hover:bg-gray-700 transition-all duration-200"
            >
                <IoPlaySkipForward size={20} />
            </button>

            {/* Track Information */}
            <div className="flex-1 mx-4">
                <input
                    type="range"
                    className="w-full h-1 bg-gray-600 rounded-lg accent-pink-500"
                    min="0"
                    max={duration}
                    step="1"
                    value={currentTime}
                    onChange={(e) => (audioRef.current.currentTime = e.target.value)}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
                <IoVolumeHigh size={20} className="text-gray-400" />
                <input
                    type="range"
                    className="w-20 h-1 bg-gray-600 rounded-lg accent-pink-500"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>

            {/* Options Button */}
            <button className="text-gray-400 hover:text-white">
                <IoEllipsisVertical size={20} />
            </button>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            />
        </div>
    );
};

export default AudioPlayer;