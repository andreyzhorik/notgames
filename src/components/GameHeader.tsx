import { Button } from './ui/button';
import { Trophy, RotateCcw, User } from 'lucide-react';

interface GameHeaderProps {
  coins: number;
  playerName: string;
  onResetCoins: () => void;
  onShowLeaderboard: () => void;
  onChangeName: () => void;
}

export const GameHeader = ({ coins, playerName, onResetCoins, onShowLeaderboard, onChangeName }: GameHeaderProps) => {
  return (
    <header className="glass-panel glow-border rounded-2xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl md:text-2xl font-bold text-primary-foreground glow-border">
            NB
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold neon-text">Neon Blue Arcade</h1>
            <p className="text-xs md:text-sm text-muted-foreground">6 mini games — bet, spin, win!</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="glass-panel px-4 py-2 rounded-lg border border-primary/20 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{playerName}</span>
          </div>
          
          <div className="glass-panel px-4 py-3 rounded-lg border border-primary/20 glow-border">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Coins</span>
              <span className="text-xl md:text-2xl font-bold neon-text tracking-wider">{coins}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onShowLeaderboard}
            className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetCoins}
            className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
