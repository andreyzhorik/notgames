import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GameHeader } from '@/components/GameHeader';
import { GameTiles } from '@/components/GameTiles';
import { WheelGame } from '@/components/games/WheelGame';
import { SlotGame } from '@/components/games/SlotGame';
import { RandomizerGame } from '@/components/games/RandomizerGame';
import { CardsGame } from '@/components/games/CardsGame';
import { DiceGame } from '@/components/games/DiceGame';
import { HighLowGame } from '@/components/games/HighLowGame';
import { Leaderboard } from '@/components/Leaderboard';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const DEFAULT_COINS = 2000;
const COINS_KEY = 'neon_coins_v1';
const NAME_KEY = 'neon_player_name';

const Index = () => {
  const [coins, setCoins] = useState(DEFAULT_COINS);
  const [playerName, setPlayerName] = useState('');
  const [tempName, setTempName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const savedCoins = localStorage.getItem(COINS_KEY);
    const savedName = localStorage.getItem(NAME_KEY);
    
    if (savedCoins) setCoins(parseInt(savedCoins));
    if (savedName) {
      setPlayerName(savedName);
    } else {
      setShowNameInput(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(COINS_KEY, Math.max(0, Math.floor(coins)).toString());
  }, [coins]);

  const handleSetName = () => {
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
      localStorage.setItem(NAME_KEY, tempName.trim());
      setShowNameInput(false);
      toast.success(`Welcome, ${tempName.trim()}!`);
    } else {
      toast.error('Please enter a valid name');
    }
  };

  const handleResetCoins = () => {
    setCoins(DEFAULT_COINS);
    toast.success('Coins reset to ' + DEFAULT_COINS);
  };

  const handleBackToMenu = () => {
    setActiveGame(null);
  };

  const renderGame = () => {
    const gameProps = { coins, setCoins, playerName };
    
    switch (activeGame) {
      case 'wheel':
        return <WheelGame {...gameProps} />;
      case 'slot':
        return <SlotGame {...gameProps} />;
      case 'randomizer':
        return <RandomizerGame {...gameProps} />;
      case 'cards':
        return <CardsGame {...gameProps} />;
      case 'dice':
        return <DiceGame {...gameProps} />;
      case 'highlow':
        return <HighLowGame {...gameProps} />;
      default:
        return null;
    }
  };

  if (showNameInput) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-panel glow-border p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground glow-border">
              NB
            </div>
            <h1 className="text-3xl font-bold neon-text">Neon Blue Arcade</h1>
            <p className="text-muted-foreground text-sm">Enter your player name to begin</p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
              className="text-center text-lg"
              maxLength={20}
            />
            <Button 
              onClick={handleSetName} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold"
              size="lg"
            >
              Start Playing
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <GameHeader 
          coins={coins} 
          playerName={playerName}
          onResetCoins={handleResetCoins}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onChangeName={() => setShowNameInput(true)}
        />

        {activeGame ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Button
              variant="outline"
              onClick={handleBackToMenu}
              className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
            
            <Card className="glass-panel glow-border p-6 md:p-8">
              {renderGame()}
            </Card>
          </div>
        ) : (
          <GameTiles onSelectGame={setActiveGame} />
        )}

        <Leaderboard 
          open={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          playerName={playerName}
          currentCoins={coins}
        />
      </div>
    </div>
  );
};

export default Index;
