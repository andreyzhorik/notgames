import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Trophy, Crown, Medal } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
  playerName: string;
  currentCoins: number;
}

const LEADERBOARD_KEY = 'neon_leaderboard_v1';

export const Leaderboard = ({ open, onClose, playerName, currentCoins }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (open) {
      loadLeaderboard();
    }
  }, [open]);

  useEffect(() => {
    // Update player's score whenever coins change
    if (playerName) {
      updatePlayerScore(playerName, currentCoins);
    }
  }, [currentCoins, playerName]);

  const loadLeaderboard = () => {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (stored) {
      const data = JSON.parse(stored) as LeaderboardEntry[];
      const sorted = data.sort((a, b) => b.score - a.score).slice(0, 10);
      setEntries(sorted);
    }
  };

  const updatePlayerScore = (name: string, score: number) => {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    let data: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
    
    // Find existing entry for this player
    const existingIndex = data.findIndex(entry => entry.name === name);
    
    if (existingIndex >= 0) {
      // Update existing player's score
      data[existingIndex] = { name, score, timestamp: Date.now() };
    } else {
      // Add new player
      data.push({ name, score, timestamp: Date.now() });
    }
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel glow-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl neon-text">
            <Trophy className="w-6 h-6" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scores yet. Play to add your score!
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={`${entry.name}-${entry.timestamp}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  entry.name === playerName 
                    ? 'glass-panel border-2 border-primary glow-border' 
                    : 'bg-muted/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center font-bold">
                    {getRankIcon(index) || `#${index + 1}`}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {entry.name}
                      {entry.name === playerName && (
                        <span className="ml-2 text-xs text-primary">(You)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold neon-text">
                  {entry.score.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          Your score updates automatically as you play
        </div>
      </DialogContent>
    </Dialog>
  );
};
