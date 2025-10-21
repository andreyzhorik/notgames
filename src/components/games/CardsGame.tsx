import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Shuffle } from 'lucide-react';

interface CardsGameProps {
  coins: number;
  setCoins: (coins: number) => void;
  playerName: string;
}

export const CardsGame = ({ coins, setCoins }: CardsGameProps) => {
  const [bet, setBet] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState('');

  const handleCardClick = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index));
    } else if (selected.length < 3) {
      setSelected([...selected, index]);
    }
  };

  const handlePick = () => {
    if (bet <= 0 || isNaN(bet)) {
      toast.error('Enter a valid bet');
      return;
    }
    if (bet > coins) {
      toast.error('Not enough coins');
      return;
    }
    if (selected.length !== 3) {
      toast.error('Select exactly 3 cards');
      return;
    }

    setCoins(coins - bet);
    setResult('');

    const isWin = Math.random() < 0.6;
    
    if (isWin) {
      const multiplier = 1.5 + Math.random() * (5.0 - 1.5);
      const winAmount = Math.round(bet * multiplier);
      setCoins(coins + winAmount);
      setResult(`🎉 Nice! ${multiplier.toFixed(2)}x → +${winAmount} coins`);
      toast.success(`Won ${winAmount} coins!`);
    } else {
      const currentCoins = coins - bet;
      const lossPercent = 25 + Math.random() * 25;
      const lossAmount = Math.round(currentCoins * (lossPercent / 100));
      setCoins(Math.max(0, currentCoins - lossAmount));
      setResult(`💥 Bad flip — lost ${lossPercent.toFixed(0)}% of coins (−${lossAmount})`);
      toast.error(`Lost ${lossAmount} coins`);
    }

    setSelected([]);
  };

  const handleShuffle = () => {
    setSelected([]);
    setResult('');
    toast.info('Grid shuffled!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold neon-text mb-2">🃏 Cards (Pick 3)</h2>
        <p className="text-sm text-muted-foreground">High risk, high reward — pick 3 cards from the grid</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(i)}
              className={`aspect-square glass-panel rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-4xl hover:scale-105 ${
                selected.includes(i) 
                  ? 'border-2 border-primary shadow-lg shadow-primary/30 glow-border' 
                  : 'border border-border'
              }`}
            >
              ?
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="cards-bet">Bet Amount</Label>
          <Input
            id="cards-bet"
            type="number"
            min="1"
            value={bet}
            onChange={(e) => setBet(parseInt(e.target.value) || 0)}
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handlePick}
            disabled={selected.length !== 3}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold"
            size="lg"
          >
            Pick Selected ({selected.length}/3)
          </Button>
          
          <Button
            onClick={handleShuffle}
            variant="outline"
            size="lg"
            className="border-primary/20"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>

        {result && (
          <div className={`text-center p-4 rounded-lg glass-panel ${result.includes('Nice') ? 'text-primary' : 'text-destructive'} font-bold`}>
            {result}
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
          <strong>Risk:</strong> 60% chance to win 1.5x–5.0x multiplier. 40% chance to lose 25%–50% of ALL coins!
        </div>
      </div>
    </div>
  );
};
