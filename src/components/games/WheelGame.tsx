import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface WheelGameProps {
  coins: number;
  setCoins: (coins: number) => void;
  playerName: string;
}

const baseSegments = ['Lose', 'Lose', 'Lose', 'Lose', 'Lose', '1.5x', '2.0x', '1.2x', '1.7x'];

export const WheelGame = ({ coins, setCoins }: WheelGameProps) => {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState('');
  const [displaySegments, setDisplaySegments] = useState<string[]>(baseSegments);
  const [wonSegment, setWonSegment] = useState<string>('');

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
    setWonSegment('');

    // Shuffle segments for each spin
    const shuffled = shuffleArray(baseSegments);
    setDisplaySegments(shuffled);
    
    const spinIndex = Math.floor(Math.random() * shuffled.length);
    const segment = shuffled[spinIndex];
    
    // Longer spin: 6 full rotations + position
    const baseRotation = 360 * 8 + (spinIndex * (360 / shuffled.length));
    setRotation(baseRotation);

    const wheel = document.getElementById('wheel-spinner');
    if (wheel) {
      wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    }

    setTimeout(() => {
      if (wheel) {
        wheel.style.transition = '';
      }
      setWonSegment(segment);
      evaluateWheelResult(segment, bet);
      setSpinning(false);
    }, 5000);
  };

  const evaluateWheelResult = (segment: string, bet: number) => {
    if (segment === 'Lose') {
      setResult(`Landed on: ${segment} — Lost ${bet} coins`);
      toast.error('You lost!');
    } else {
      const multiplier = parseFloat(segment.replace('x', ''));
      const winAmount = Math.round(bet * multiplier);
      setCoins(coins - bet + winAmount);
      setResult(`Landed on: ${segment} — Won ${winAmount} coins!`);
      toast.success(`You won ${winAmount} coins!`);
    }
  };

  useEffect(() => {
    // Initial shuffle
    setDisplaySegments(shuffleArray(baseSegments));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold neon-text mb-2">🎡 Spin the Wheel</h2>
        <p className="text-sm text-muted-foreground">Segments shuffle each spin! Land on a multiplier to win.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="relative flex flex-col items-center gap-4">
          <div 
            id="wheel-spinner"
            className="w-64 h-64 rounded-full border-8 border-primary/30 glow-border transition-transform duration-[5000ms] ease-out relative overflow-hidden"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: 'conic-gradient(from 0deg, hsl(var(--card)) 0%, hsl(var(--primary) / 0.1) 100%)'
            }}
          >
            {/* Wheel segments with labels */}
            {displaySegments.map((segment, index) => {
              const angle = (360 / displaySegments.length) * index;
              const isLose = segment === 'Lose';
              const isWinner = wonSegment === segment && index === displaySegments.findIndex(s => s === wonSegment);
              return (
                <div
                  key={`${segment}-${index}`}
                  className="absolute w-full h-full flex items-start justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  <div 
                    className={`text-xs font-bold mt-4 px-2 py-1 rounded transition-all duration-300 ${
                      isWinner 
                        ? 'text-primary bg-primary/30 scale-125 animate-pulse' 
                        : isLose 
                          ? 'text-destructive bg-destructive/10' 
                          : 'text-primary bg-primary/10'
                    }`}
                    style={{ transform: 'rotate(0deg)' }}
                  >
                    {segment}
                  </div>
                </div>
              );
            })}
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-card/80 rounded-full w-20 h-20 flex items-center justify-center">
                <div className="text-3xl">🎰</div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-4 h-8 bg-primary rounded-b-full glow-border shadow-lg shadow-primary/50" />
          </div>
          
          <div className="text-sm text-muted-foreground bg-muted/20 px-4 py-2 rounded-lg">
            Segments shuffle each spin!
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
            <div className={`text-center p-4 rounded-lg glass-panel font-bold ${
              result.includes('Won') ? 'text-primary animate-pulse' : 'text-destructive'
            }`}>
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
