import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { WalletConnect } from "./components/wallet-connect";
import { GameBoard } from "./components/GameBoard";
import { GameResult } from "./components/GameResult";
import { GameStats } from "./components/GameStats";
import { useMemoryGame } from "./hooks/useMemoryGame";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Play hover sound function
  const playHoverSound = () => {
    const hoverSound = new Audio("/audios/hover.mp3");
    hoverSound.volume = 1;
    hoverSound.play().catch(() => {});
  };

  // Apply theme to document for scrollbar styling
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  const {
    address,
    gridSize,
    betAmount,
    gameStatus,
    matchesFound,
    totalPairs,
    potentialReward,
    maxFlips,
    flips,
    correctPairs,
    wrongPairs,
    netGain,
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
    withdrawWinnings,
  } = useMemoryGame();

  // Handle transaction confirmations
  useEffect(() => {
    handleConfirmation();
  }, [handleConfirmation]);

  const handleGameComplete = () => {
    endGame();
  };

  const bgColor = isDarkMode ? "bg-[#3C1F47]" : "bg-[#FFFFFF]";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const borderColor = "border-black border-2";
  const cardBg = isDarkMode ? "bg-[#1d505c]" : "bg-[#F4F9E9]";

  return (
    <div
      className={`min-h-screen ${textColor} ${!isDarkMode ? "light-mode" : ""}`}
      style={{
        backgroundColor: isDarkMode ? "#153243" : "#F4F9E9",
        backgroundImage: isDarkMode
          ? `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
          : `linear-gradient(rgba(0, 0, 0, 0.09) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0, 0, 0, 0.09) 1px, transparent 1px)`,
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
              className={`p-3 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer`}
              style={{
                backgroundColor: isDarkMode ? "#0fa594" : "#FCFF51",
              }}
            >
              {isDarkMode ? (
                <Moon className="w-6 h-6 text-black" />
              ) : (
                <Sun className="w-6 h-6 text-black" />
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
                  className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed transition-all`}
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
                  className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${cardBg} ${textColor} text-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] focus:outline-none 
                    disabled:opacity-80 disabled:cursor-not-allowed transition-all`}
                />
              </div>
            </div>

            {/* Quick Bets */}
            <div>
              <p className={`text-md font-semibold mb-2 ${textColor}`}>
                Quick Bets:
              </p>
              <div className="flex flex-wrap gap-2">
                {["0.01", "0.5", "2", "5", "10"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => updateBetAmount(amount)}
                    disabled={gameStatus !== "idle"}
                    className={`px-4 py-2 rounded-lg border ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed`}
                    style={{
                      backgroundColor: isDarkMode ? "#1d505c" : "#F4F9E9",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode
                        ? "#0fa594"
                        : "#FCFF51";
                      e.currentTarget.style.color = "black";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode
                        ? "#1d505c"
                        : "#F4F9E9";
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
                !address ||
                isLoading ||
                !betAmount ||
                parseFloat(betAmount) <= 0 ||
                gameStatus !== "idle"
              }
              className={`w-full py-4 rounded-lg border ${borderColor} text-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transition-all cursor-pointer disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 hover:shadow-none hover:translate-x-1 hover:translate-y-1`}
              style={{
                backgroundColor:
                  !address ||
                  isLoading ||
                  !betAmount ||
                  parseFloat(betAmount) <= 0 ||
                  gameStatus !== "idle"
                    ? isDarkMode
                      ? "#5fb5ad"
                      : "#FCFBA7"
                    : isDarkMode
                    ? "#0fa594"
                    : "#FCFF51",
                color: "#000000",
              }}
            >
              {!address
                ? "Wallet Not Connected"
                : isLoading
                ? "Starting..."
                : "Start Game"}
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
                      style={{
                        color: isDarkMode ? "#fff" : "#000000",
                        fontWeight: "bolder",
                      }}
                    >
                      {potentialReward} CELO
                    </span>
                  </div>
                </div>
              )}

              {(gameStatus === "playing" || gameStatus === "starting") && (
                <GameStats
                  matchesFound={matchesFound}
                  totalPairs={totalPairs}
                  betAmount={betAmount}
                  potentialReward={potentialReward}
                  flips={flips}
                  maxFlips={maxFlips}
                  correctPairs={correctPairs}
                  wrongPairs={wrongPairs}
                  netGain={netGain}
                  gridSize={gridSize}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </div>

          {/* Right Column - Game Board */}
          <div
            className={`rounded-lg border ${borderColor} ${cardBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6 flex items-center justify-center max-h-[800px] `}
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
                        isDarkMode ? "bg-[#153243]" : "bg-[#F4F9E9]"
                      }`}
                      onMouseEnter={playHoverSound}
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
                    borderColor: isDarkMode ? "#0fa594" : "#000000",
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
                flips={flips}
                maxFlips={maxFlips}
              />
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
          correctPairs={correctPairs}
          wrongPairs={wrongPairs}
          netGain={netGain}
          onPlayAgain={resetGame}
          onWithdraw={withdrawWinnings}
          isWithdrawing={isLoading}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default App;
