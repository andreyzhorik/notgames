import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HighLowGameProps {
  coins: number;
  setCoins: (coins: number) => void;
  playerName: string;
}

export const HighLowGame = ({ coins, setCoins }: HighLowGameProps) => {
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState('');

  const handleGuess = (isHigher: boolean) => {
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

    const number = Math.floor(Math.random() * 100) + 1;
    
    if (number === 50) {
      setResult(`Number was 50 — House wins!`);
      toast.error('Tie goes to the house');
      return;
    }

    const correct = isHigher ? number > 50 : number < 50;
    
    if (!correct) {
      setResult(`Number was ${number} — Wrong guess!`);
      toast.error(`Number was ${number} — You lost`);
    } else {
      const distance = isHigher ? (number - 51) : (50 - number);
      const multiplier = 1 + (distance / 49) * 3.0;
      const winAmount = Math.round(bet * multiplier);
      setCoins(coins + winAmount);
      setResult(`Number was ${number} — Correct! Won ${winAmount} coins (${multiplier.toFixed(2)}x)`);
      toast.success(`Won ${winAmount} coins!`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold neon-text mb-2">🎯 High or Low</h2>
        <p className="text-sm text-muted-foreground">Guess if the number (1-100) is higher or lower than 50</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="hl-bet">Bet Amount</Label>
          <Input
            id="hl-bet"
            type="number"
            min="1"
            value={bet}
            onChange={(e) => setBet(parseInt(e.target.value) || 0)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleGuess(true)}
            className="bg-gradient-to-br from-primary to-accent hover:opacity-90 text-primary-foreground font-bold gap-2"
            size="lg"
          >
            <TrendingUp className="w-5 h-5" />
            Higher (51-100)
          </Button>
          
          <Button
            onClick={() => handleGuess(false)}
            className="bg-gradient-to-br from-accent to-primary hover:opacity-90 text-primary-foreground font-bold gap-2"
            size="lg"
          >
            <TrendingDown className="w-5 h-5" />
            Lower (1-49)
          </Button>
        </div>

        {result && (
          <div className={`text-center p-4 rounded-lg glass-panel ${result.includes('Won') || result.includes('Correct') ? 'text-primary' : 'text-destructive'} font-bold`}>
            {result}
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
          <strong>Payouts:</strong> More extreme numbers = higher multiplier (up to 4.0x). Number 50 = house wins.
        </div>
      </div>
    </div>
  );
};
