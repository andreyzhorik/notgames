import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface RandomizerGameProps {
  coins: number;
  setCoins: (coins: number) => void;
  playerName: string;
}

export const RandomizerGame = ({ coins, setCoins }: RandomizerGameProps) => {
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState('');

  const handleSpin = () => {
    if (bet <= 0 || isNaN(bet)) {
      toast.error('Enter a valid bet');
      return;
    }
    if (bet > coins) {
      toast.error('Not enough coins');
      return;
    }

    setCoins(coins - bet);
    setResult('');

    const isWin = Math.random() >= 0.5;
    
    if (!isWin) {
      setResult(`Lost ${bet} coins`);
      toast.error('You lost!');
    } else {
      const multiplier = 1.1 + Math.random() * (2.5 - 1.1);
      const winAmount = Math.round(bet * multiplier);
      setCoins(coins + winAmount);
      setResult(`Won ${winAmount} coins (${multiplier.toFixed(2)}x)`);
      toast.success(`You won ${winAmount} coins!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold neon-text mb-2">🎲 Randomizer</h2>
        <p className="text-sm text-muted-foreground">50/50 chance — high risk, high reward!</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="rand-bet">Bet Amount</Label>
          <Input
            id="rand-bet"
            type="number"
            min="1"
            value={bet}
            onChange={(e) => setBet(parseInt(e.target.value) || 0)}
            className="mt-1"
          />
        </div>

        <Button
          onClick={handleSpin}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold"
          size="lg"
        >
          Randomize
        </Button>

        {result && (
          <div className={`text-center p-4 rounded-lg glass-panel ${result.includes('Won') ? 'text-primary' : 'text-destructive'} font-bold text-lg`}>
            {result}
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
          <strong>Rules:</strong> 50% chance to lose your bet. Otherwise, win a random multiplier between 1.1x and 2.5x.
        </div>
      </div>
    </div>
  );
};
