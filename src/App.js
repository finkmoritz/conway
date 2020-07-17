import { Client } from 'boardgame.io/react';
import { ConwayGame } from './Game';
import { ConwayBoard } from './Board';

const App = Client({
    game: ConwayGame,
    board: ConwayBoard,
});

export default App;
