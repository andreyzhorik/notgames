import { Card } from './ui/card';

const games = [
  {
    id: 'wheel',
    title: 'Spin the Wheel',
    description: 'Random multipliers or lose',
    emoji: '🎡'
  },
  {
    id: 'slot',
    title: 'Slotomania',
    description: '7, 🍒, 🏆, 💵 — combos pay out',
    emoji: '🎰'
  },
  {
    id: 'randomizer',
    title: 'Randomizer',
    description: '50/50 lose or 1.1x–2.5x',
    emoji: '🎲'
  },
  {
    id: 'cards',
    title: 'Cards (Pick 3)',
    description: '3×3 grid — big risk & reward',
    emoji: '🃏'
  },
  {
    id: 'dice',
    title: 'Dice Roll',
    description: 'Roll two dice — total ≥6 to win',
    emoji: '🎲'
  },
  {
    id: 'highlow',
    title: 'High or Low',
    description: 'Guess if number is higher or lower',
    emoji: '🎯'
  }
];

interface GameTilesProps {
  onSelectGame: (gameId: string) => void;
}

export const GameTiles = ({ onSelectGame }: GameTilesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
      {games.map((game, index) => (
        <Card
          key={game.id}
          className="glass-panel glow-border p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group"
          onClick={() => onSelectGame(game.id)}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="text-center space-y-3">
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
              {game.emoji}
            </div>
            <h2 className="text-lg font-bold neon-text">{game.title}</h2>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
