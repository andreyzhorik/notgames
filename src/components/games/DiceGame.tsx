import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface DiceGameProps {
  coins: number;
  setCoins: (coins: number) => void;
  playerName: string;
}

export const DiceGame = ({ coins, setCoins }: DiceGameProps) => {
  const [bet, setBet] = useState(10);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [result, setResult] = useState('');
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    if (bet <= 0 || isNaN(bet)) {
      toast.error('Enter a valid bet');
      return;
    }
    if (bet > coins) {
      toast.error('Not enough coins');
      return;
    }

    setCoins(coins - bet);
    setRolling(true);
    setResult('');

    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ] as [number, number]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDice([d1, d2]);
      
      const total = d1 + d2;
      
      if (total < 6) {
        setResult(`Rolled ${d1} + ${d2} = ${total} — You lost!`);
        toast.error(`Total ${total} < 6 — Lost!`);
      } else {
        const maxDie = Math.max(d1, d2);
        const multiplier = 0.9 + ((maxDie - 1) / 5) * 1.6;
        const winAmount = Math.round(bet * multiplier);
        setCoins(coins + winAmount);
        setResult(`Rolled ${d1} + ${d2} = ${total} — Won ${winAmount} coins (${multiplier.toFixed(2)}x)`);
        toast.success(`Won ${winAmount} coins!`);
      }
      
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold neon-text mb-2">🎲 Dice Roll</h2>
        <p className="text-sm text-muted-foreground">Roll two dice — total must be ≥6 to win!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex gap-4">
          {dice.map((die, i) => (
            <div
              key={i}
              className="w-24 h-24 glass-panel glow-border rounded-2xl flex items-center justify-center text-5xl font-bold transition-all duration-300"
            >
              {rolling ? '?' : die}
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-4 w-full max-w-md">
          <div>
            <Label htmlFor="dice-bet">Bet Amount</Label>
            <Input
              id="dice-bet"
              type="number"
              min="1"
              value={bet}
              onChange={(e) => setBet(parseInt(e.target.value) || 0)}
              disabled={rolling}
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleRoll}
            disabled={rolling}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold"
            size="lg"
          >
            {rolling ? 'Rolling...' : 'Roll Dice'}
          </Button>

          {result && (
            <div className={`text-center p-4 rounded-lg glass-panel ${result.includes('Won') ? 'text-primary' : 'text-destructive'} font-bold`}>
              {result}
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
            <strong>Rules:</strong> Total must be ≥6 to win. Multiplier based on highest die (higher = better payout).
          </div>
        </div>
      </div>
    </div>
  );
};
