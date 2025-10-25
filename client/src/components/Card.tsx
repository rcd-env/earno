import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (isFlipped || isMatched) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, isMatched]);

  const handleClick = () => {
    if (!isFlipped && !isMatched && !isAnimating) {
      onClick(id);
    }
  };

  return (
    <div
      className="relative w-full aspect-square cursor-pointer perspective-1000"
      onClick={handleClick}
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
