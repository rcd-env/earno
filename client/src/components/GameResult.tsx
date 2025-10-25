import { Crown, HeartCrack } from "lucide-react";

interface GameResultProps {
  won: boolean;
  reward: string;
  betAmount: string;
  matchesFound: number;
  totalPairs: number;
  onPlayAgain: () => void;
  isDarkMode?: boolean;
}

export function GameResult({
  won,
  reward,
  betAmount,
  matchesFound,
  totalPairs,
  onPlayAgain,
  isDarkMode = false,
}: GameResultProps) {
  const bgColor = isDarkMode ? "#1d505c" : "#F4F9E9";
  const textColor = isDarkMode ? "white" : "#000000";
  const borderColor = "border-black border-2";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl p-8 max-w-md w-full text-center space-y-6 animate-fade-in ${borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Result Title */}
        <h2 className="text-4xl font-bold" style={{ color: textColor }}>
          {won ? (
            <span className="flex gap-3 justify-center items-center">
              You Won <Crown size={45} strokeWidth={2} />
            </span>
          ) : (
            <span className="flex gap-3 justify-center items-center">
              You Lost <HeartCrack size={45} strokeWidth={2} />
            </span>
          )}
        </h2>

        {/* Stats */}
        <div className="space-y-3">
          <div
            className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: isDarkMode ? "#3C1F47" : "#F4F9E9",
              color: textColor,
            }}
          >
            <div className="text-sm opacity-70">Matches Found</div>
            <div className="text-2xl font-bold">
              {matchesFound} / {totalPairs}
            </div>
          </div>

          <div
            className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
            style={{
              backgroundColor: isDarkMode ? "#3C1F47" : "#F4F9E9",
              color: textColor,
            }}
          >
            <div className="text-sm opacity-70">Bet Amount</div>
            <div className="text-xl font-bold">{betAmount} CELO</div>
          </div>

          {won && (
            <div
              className={`rounded-lg p-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
              style={{
                backgroundColor: isDarkMode ? "#B490FF" : "#FCFF51",
                color: "#000000",
              }}
            >
              <div className="text-sm font-medium">Reward</div>
              <div className="text-3xl font-bold">+{reward} CELO</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={onPlayAgain}
          className={`w-full font-bold py-3 rounded-lg transition text-lg ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer`}
          style={{
            backgroundColor: isDarkMode ? "#B490FF" : "#FCFF51",
            color: "#000000",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
