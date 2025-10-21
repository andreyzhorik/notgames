import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface WheelGameProps {
  coins: number;
  setCoins: (coins: number) => void;
  playerName: string;
}

const wheelSegments = ['Lose', 'Lose', 'Lose', 'Lose', 'Lose', '1.5x', '2.0x', '1.2x', '1.7x'];

export const WheelGame = ({ coins, setCoins }: WheelGameProps) => {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState('');

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

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

    // Shuffle segments for each spin
    const shuffled = shuffleArray(wheelSegments);
    const spinIndex = Math.floor(Math.random() * shuffled.length);
    const segment = shuffled[spinIndex];
    
    const baseRotation = 360 * 5 + (spinIndex * (360 / shuffled.length));
    setRotation(baseRotation);

    setTimeout(() => {
      setSpinning(false);
      
      if (segment === 'Lose') {
        setResult(`Lost ${bet} coins`);
        toast.error('You lost!');
      } else {
        const multiplier = parseFloat(segment.replace('x', ''));
        const winAmount = Math.round(bet * multiplier);
        setCoins(coins - bet + winAmount);
        setResult(`Won ${winAmount} coins (${segment})`);
        toast.success(`You won ${winAmount} coins!`);
      }
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold neon-text mb-2">🎡 Spin the Wheel</h2>
        <p className="text-sm text-muted-foreground">Segments shuffle each spin! Land on a multiplier to win.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="relative">
          <div 
            className="w-64 h-64 rounded-full border-8 border-primary/30 glow-border transition-transform duration-[3000ms] ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: 'conic-gradient(from 0deg, hsl(var(--card)) 0%, hsl(var(--primary) / 0.1) 100%)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎰</div>
                <div className="text-xs text-muted-foreground">Spin!</div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <div className="w-4 h-8 bg-primary rounded-b-full glow-border shadow-lg shadow-primary/50" />
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full max-w-md">
          <div>
            <Label htmlFor="wheel-bet">Bet Amount</Label>
            <Input
              id="wheel-bet"
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
            {spinning ? 'Spinning...' : 'Spin Wheel'}
          </Button>

          {result && (
            <div className={`text-center p-4 rounded-lg glass-panel ${result.includes('Won') ? 'text-primary' : 'text-destructive'} font-bold`}>
              {result}
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
            <strong>Payouts:</strong> Segments include 5× Lose, 1.5x, 2.0x, 1.2x, 1.7x (shuffled each spin)
          </div>
        </div>
      </div>
    </div>
  );
};
