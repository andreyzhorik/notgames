import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface SlotGameProps {
  coins: number;
  setCoins: (coins: number) => void;
  playerName: string;
}

const slotSymbols = ['7', '🍒', '🏆', '💵'];

export const SlotGame = ({ coins, setCoins }: SlotGameProps) => {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['—', '—', '—']);
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
    setSpinning(true);
    setResult('');
    setReels(['❯', '❯', '❯']);

    const results: string[] = [];
    
    setTimeout(() => {
      results[0] = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
      setReels([results[0], '❯', '❯']);
    }, 200);

    setTimeout(() => {
      results[1] = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
      setReels([results[0], results[1], '❯']);
    }, 400);

    setTimeout(() => {
      results[2] = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
      setReels(results);
      evaluateSlot(results);
      setSpinning(false);
    }, 600);
  };

  const evaluateSlot = (results: string[]) => {
    const counts: Record<string, number> = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    if (counts['💵'] === 3) {
      setCoins(coins + 1000);
      setResult('🎉 Three 💵! +1000 coins');
      toast.success('Jackpot! +1000 coins');
      return;
    }
    if (counts['💵'] === 2) {
      setCoins(coins + 100);
      setResult('Two 💵! +100 coins');
      toast.success('+100 coins');
      return;
    }

    for (const symbol of ['7', '🍒', '🏆']) {
      if (counts[symbol] === 3) {
        const multiplier = symbol === '7' ? 2.5 : 2.0;
        const winAmount = Math.round(bet * multiplier);
        setCoins(coins + winAmount);
        setResult(`3×${symbol} → Won ${winAmount} coins (${multiplier}x)`);
        toast.success(`Won ${winAmount} coins!`);
        return;
      }
    }

    for (const symbol of ['7', '🍒', '🏆']) {
      if (counts[symbol] === 2) {
        const multiplier = symbol === '7' ? 1.5 : 1.3;
        const winAmount = Math.round(bet * multiplier);
        setCoins(coins + winAmount);
        setResult(`2×${symbol} → Won ${winAmount} coins (${multiplier}x)`);
        toast.success(`Won ${winAmount} coins!`);
        return;
      }
    }

    setResult('No win');
    toast.error('No match');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold neon-text mb-2">🎰 Slotomania</h2>
        <p className="text-sm text-muted-foreground">Match symbols to win big!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex gap-3">
          {reels.map((symbol, i) => (
            <div
              key={i}
              className="w-20 h-20 md:w-24 md:h-24 glass-panel glow-border rounded-xl flex items-center justify-center text-4xl md:text-5xl transition-all duration-300"
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-4 w-full max-w-md">
          <div>
            <Label htmlFor="slot-bet">Bet Amount</Label>
            <Input
              id="slot-bet"
              type="number"
              min="1"
              value={bet}
              onChange={(e) => setBet(parseInt(e.target.value) || 0)}
              disabled={spinning}
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleSpin}
            disabled={spinning}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold"
            size="lg"
          >
            {spinning ? 'Spinning...' : 'Spin Slots'}
          </Button>

          {result && (
            <div className={`text-center p-4 rounded-lg glass-panel ${result.includes('Won') || result.includes('+') ? 'text-primary' : 'text-destructive'} font-bold`}>
              {result}
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg space-y-1">
            <div><strong>3×7</strong> = 2.5x | <strong>3×🍒 or 🏆</strong> = 2.0x | <strong>3×💵</strong> = +1000</div>
            <div><strong>2×7</strong> = 1.5x | <strong>2×🍒 or 🏆</strong> = 1.3x | <strong>2×💵</strong> = +100</div>
          </div>
        </div>
      </div>
    </div>
  );
};
