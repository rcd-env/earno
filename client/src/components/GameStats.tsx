interface GameStatsProps {
  matchesFound: number;
  totalPairs: number;
  betAmount: string;
  potentialReward: string;
}

export function GameStats({
  matchesFound,
  totalPairs,
  betAmount,
  potentialReward,
}: GameStatsProps) {
  const progress = totalPairs > 0 ? (matchesFound / totalPairs) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-6 space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Progress</span>
            <span className="text-blue-400 font-bold">
              {matchesFound} / {totalPairs} pairs
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center pt-2">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wider">
              Bet Amount
            </div>
            <div className="text-white text-lg font-bold mt-1">
              {betAmount} CELO
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wider">
              Matches Found
            </div>
            <div className="text-blue-400 text-lg font-bold mt-1">
              {matchesFound}/{totalPairs}
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-blue-500/30">
            <div className="text-slate-400 text-xs uppercase tracking-wider">
              Potential Win
            </div>
            <div className="text-blue-400 text-lg font-bold mt-1">
              {potentialReward} CELO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
