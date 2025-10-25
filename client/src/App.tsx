import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { WalletConnect } from "./components/wallet-connect";
import { GameBoard } from "./components/GameBoard";
import { GameResult } from "./components/GameResult";
import { useMemoryGame } from "./hooks/useMemoryGame";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    gridSize,
    betAmount,
    gameStatus,
    matchesFound,
    totalPairs,
    potentialReward,
    maxFlips,
    flips,
    isLoading,
    startGame,
    recordMatch,
    endGame,
    resetGame,
    updateGridSize,
    updateBetAmount,
    handleConfirmation,
    incrementFlips,
    checkFlipLimit,
  } = useMemoryGame();

  // Handle transaction confirmations
  useEffect(() => {
    handleConfirmation();
  }, [handleConfirmation]);

  const handleGameComplete = () => {
    endGame();
  };

  const bgColor = isDarkMode ? "bg-[#3C1F47]" : "bg-[#FCF6F1]";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";
  const cardBg = isDarkMode ? "bg-[#502A5E]" : "bg-[#FFF8F0]";

  return (
    <div
      className={`min-h-screen ${textColor}`}
      style={{
        backgroundColor: isDarkMode ? "#3C1F47" : "#FCF6F1",
        backgroundImage: isDarkMode
          ? `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`
          : `linear-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0, 0, 0, 0.15) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    >
      {/* Top Bar */}
      <header className={`px-8 py-6 ${bgColor} bg-transparent`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Brand Name */}
          <h1 className="text-4xl font-bold font-Tsuchigumo tracking-wider brand">
            Earno
          </h1>

          {/* Theme Toggle & Wallet Connect */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer`}
              style={{
                backgroundColor: isDarkMode ? "#B490FF" : "#FCFF51",
              }}
            >
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-black" />
              ) : (
                <Sun className="w-5 h-5 text-black" />
              )}
            </button>
            <WalletConnect isDarkMode={isDarkMode} />
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Grid Size & Bet Amount in Same Row */}
            <div className="flex gap-4">
              {/* Grid Size Selector - 1/3 width */}
              <div className="w-1/3">
                <label
                  className={`block text-lg font-medium mb-3 ${textColor}`}
                >
                  Grid Size
                </label>
                <select
                  value={`${gridSize}x${gridSize}`}
                  onChange={(e) => {
                    const size = parseInt(e.target.value.split("x")[0]);
                    updateGridSize(size);
                  }}
                  disabled={gameStatus !== "idle"}
                  className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  <option value="2x2">2x2</option>
                  <option value="4x4">4x4</option>
                  <option value="6x6">6x6</option>
                  <option value="8x8">8x8</option>
                </select>
              </div>

              {/* Bet Amount Input - 2/3 width */}
              <div className="w-2/3">
                <label
                  className={`block text-lg font-medium mb-3 ${textColor}`}
                >
                  Place Your Bet
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={betAmount}
                  onChange={(e) => updateBetAmount(e.target.value)}
                  disabled={gameStatus !== "idle"}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                />
              </div>
            </div>

            {/* Quick Bets */}
            <div>
              <p className={`text-sm mb-2 ${textColor} opacity-70`}>
                Quick Bets:
              </p>
              <div className="flex flex-wrap gap-2">
                {["0.01", "0.5", "2", "5", "10"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => updateBetAmount(amount)}
                    disabled={gameStatus !== "idle"}
                    className={`px-4 py-2 rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode
                        ? "#B490FF"
                        : "#FCFF51";
                      e.currentTarget.style.color = "black";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {amount}Celo
                  </button>
                ))}
              </div>
            </div>

            {/* Start Game Button */}
            <button
              onClick={startGame}
              disabled={
                isLoading ||
                !betAmount ||
                parseFloat(betAmount) <= 0 ||
                gameStatus !== "idle"
              }
              className={`w-full py-4 rounded-lg border ${borderColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all cursor-pointer disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 hover:shadow-none hover:translate-x-1 hover:translate-y-1`}
              style={{
                backgroundColor:
                  isLoading ||
                  !betAmount ||
                  parseFloat(betAmount) <= 0 ||
                  gameStatus !== "idle"
                    ? isDarkMode
                      ? "#7957A2"
                      : "#FCFBA7"
                    : isDarkMode
                    ? "#B490FF"
                    : "#FCFF51",
                color: "#000000",
              }}
            >
              {isLoading ? "Starting..." : "Start Game"}
            </button>

            {/* Game Stats Box */}
            <div
              className={`p-6 rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] min-h-[200px]`}
            >
              <h3 className={`text-xl font-medium mb-4 ${textColor}`}>
                {gameStatus === "idle" ? "Game Stats" : "Game Progress"}
              </h3>

              {gameStatus === "idle" && (
                <div className="space-y-3">
                  <p className="text-sm opacity-70">
                    Configure your game settings above
                  </p>
                  <div className="flex justify-between">
                    <span className="">Grid Size:</span>
                    <span className="font-bold">
                      {gridSize}×{gridSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Max Flips Allowed:</span>
                    <span className="font-bold">{maxFlips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Potential Reward:</span>
                    <span
                      className="font-bold"
                      style={{ color: isDarkMode ? "#B490FF" : "#000000" }}
                    >
                      {potentialReward} CELO
                    </span>
                  </div>
                </div>
              )}

              {(gameStatus === "playing" || gameStatus === "starting") && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-70">Flips Used:</span>
                    <span
                      className="font-bold"
                      style={{ color: isDarkMode ? "#B490FF" : "#000000" }}
                    >
                      {flips}/{maxFlips}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Matches Found:</span>
                    <span
                      className="font-bold"
                      style={{ color: isDarkMode ? "#B490FF" : "#000000" }}
                    >
                      {matchesFound}/{totalPairs}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Bet Amount:</span>
                    <span className="font-bold">{betAmount} CELO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Potential Win:</span>
                    <span
                      className="font-bold"
                      style={{ color: isDarkMode ? "#B490FF" : "#000000" }}
                    >
                      {potentialReward} CELO
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden`}
                      style={{
                        backgroundColor: isDarkMode ? "#3C1F47" : "#E5D4C1",
                      }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          backgroundColor: isDarkMode ? "#B490FF" : "#FCFF51",
                          width: `${
                            totalPairs > 0
                              ? (matchesFound / totalPairs) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {gameStatus === "claiming" && (
                <div className="text-center">
                  <div
                    className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent mb-2"
                    style={{
                      borderColor: isDarkMode ? "#B490FF" : "#000000",
                      borderTopColor: "transparent",
                    }}
                  ></div>
                  <p>Processing reward...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Game Board */}
          <div
            className={`rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6 flex items-center justify-center max-h-[800px]`}
          >
            {gameStatus === "idle" && (
              <div
                className="grid gap-3 w-full"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  maxWidth: "500px",
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                  <div key={index} className="relative w-full aspect-square">
                    <div
                      className={`absolute w-full h-full rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center ${
                        isDarkMode ? "bg-[#502A5E]" : "bg-[#FFF8F0]"
                      }`}
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
                  </div>
                ))}
              </div>
            )}

            {gameStatus === "starting" && (
              <div className="text-center">
                <div
                  className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mb-4"
                  style={{
                    borderColor: isDarkMode ? "#B490FF" : "#000000",
                    borderTopColor: "transparent",
                  }}
                ></div>
                <p className="text-lg opacity-70">Starting game...</p>
              </div>
            )}

            {gameStatus === "playing" && (
              <GameBoard
                gridSize={gridSize}
                onMatch={recordMatch}
                onGameComplete={handleGameComplete}
                disabled={false}
                isDarkMode={isDarkMode}
                onFlip={incrementFlips}
                checkFlipLimit={checkFlipLimit}
              />
            )}

            {gameStatus === "claiming" && (
              <div className="text-center">
                <div
                  className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mb-4"
                  style={{
                    borderColor: isDarkMode ? "#B490FF" : "#000000",
                    borderTopColor: "transparent",
                  }}
                ></div>
                <p className="text-xl font-bold">Claiming your reward...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Game Result Modal */}
      {gameStatus === "completed" && (
        <GameResult
          won={matchesFound === totalPairs}
          reward={potentialReward}
          betAmount={betAmount}
          matchesFound={matchesFound}
          totalPairs={totalPairs}
          onPlayAgain={resetGame}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default App;
