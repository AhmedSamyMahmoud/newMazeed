import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Define props interface for VideoPlayer component
interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1" | "4:3";
  controls?: boolean;
  autoplay?: boolean;
}

export function VideoPlayer({
  src,
  poster,
  className = "",
  aspectRatio = "9:16",
  controls = true,
  autoplay = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls,
        autoplay,
        playbackRates: [0.5, 1, 1.5, 2],
        responsive: true,
        fluid: true,
        sources: [{ src, type: "video/mp4" }],
        poster,
      });

      setLoaded(true);
    } else if (playerRef.current && src) {
      playerRef.current.src([{ src, type: "video/mp4" }]);
      if (poster) {
        playerRef.current.poster(poster);
      }
    }

    // Dispose the Video.js player when the component unmounts
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, controls, autoplay]);

  const aspectRatioClass = 
    aspectRatio === "16:9" ? "aspect-w-16 aspect-h-9" :
    aspectRatio === "9:16" ? "aspect-w-9 aspect-h-16" :
    aspectRatio === "1:1" ? "aspect-w-1 aspect-h-1" :
    "aspect-w-4 aspect-h-3";

  return (
    <div className={`${aspectRatioClass} ${className}`}>
      <div data-vjs-player>
        <div ref={videoRef} className="h-full w-full" />
      </div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-primary-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
