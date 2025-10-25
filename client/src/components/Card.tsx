import { useState, useEffect, useRef } from "react";

interface CardProps {
  id: number;
  value: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  isDarkMode: boolean;
}

export function Card({
  id,
  value,
  color,
  isFlipped,
  isMatched,
  onClick,
  isDarkMode,
}: CardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [wasMatched, setWasMatched] = useState(false);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);
  const matchSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    // Create hover sound (high pitch click)
    const hoverSound = new Audio();
    hoverSound.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgQ==";
    hoverSound.volume = 0.2;
    hoverSoundRef.current = hoverSound;

    // Create flip sound (whoosh)
    const flipSound = new Audio();
    flipSound.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==";
    flipSound.volume = 0.3;
    flipSoundRef.current = flipSound;

    // Create match sound (ding)
    const matchSound = new Audio();
    matchSound.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgQ==";
    matchSound.volume = 0.4;
    matchSoundRef.current = matchSound;
  }, []);

  useEffect(() => {
    if (isFlipped || isMatched) {
      setIsAnimating(true);

      // Play flip sound when card flips
      if (isFlipped && !wasMatched && flipSoundRef.current) {
        flipSoundRef.current.currentTime = 0;
        flipSoundRef.current.play().catch(() => {});
      }

      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, isMatched, wasMatched]);

  // Play match sound when card is matched
  useEffect(() => {
    if (isMatched && !wasMatched && matchSoundRef.current) {
      setTimeout(() => {
        matchSoundRef.current?.play().catch(() => {});
      }, 500); // Delay to sync with match animation
      setWasMatched(true);
    }
  }, [isMatched, wasMatched]);

  const handleClick = () => {
    if (!isFlipped && !isMatched && !isAnimating) {
      onClick(id);
    }
  };

  const handleMouseEnter = () => {
    if (!isFlipped && !isMatched && hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      className="relative w-full aspect-square cursor-pointer perspective-1000"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${
          isFlipped || isMatched ? "rotate-y-180" : ""
        }`}
      >
        {/* Card Back (Hidden State) */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          style={{
            backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
          }}
        >
          <div
            className="text-4xl font-bold"
            style={{
              color: isDarkMode ? "white" : "#000000",
            }}
          >
            ?
          </div>
        </div>

        {/* Card Front (Revealed State) */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-xl flex items-center justify-center rotate-y-180 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
          style={{
            backgroundColor: color,
          }}
        >
          <div className="text-5xl font-bold text-black card">{value}</div>
        </div>
      </div>
    </div>
  );
}
