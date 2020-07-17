export const ConwayGame = {
    setup: () => (getInitialState()),

    turn: {
        moveLimit: 1,
    },

    moves: {
        clickCell: (G, ctx, id) => {
            switch (G.cells[id].state) {
                case "DEAD":
                    G.cells[id].state = "ALIVE";
                    G.cells[id].player = parseInt(ctx.currentPlayer);
                    break;
                case "ALIVE":
                    G.cells[id].state = "DEAD";
                    G.cells[id].player = undefined;
                    break;
                default:
            }
        }
    },

    endIf: (G, ctx) => {
        if (isDraw(G.cells)) {
            return { draw: true };
        }
        const winner = getWinner(G.cells);
        if (winner !== undefined) {
            return { winner: winner };
        }
    },

    ai: {
        enumerate: (G, ctx) => {
            let moves = [];
            for (let i = 0; i < 25; i++) {
                if(G.cells[i].state !== "VOID") {
                    moves.push({ move: 'clickCell', args: [i] });
                }
            }
            return moves;
        },
    },
};

function getInitialState() {
    const cells = Array(25);
    const randomPositions = [...Array(25).keys()];
    shuffleArray(randomPositions);
    for(let i=0; i<6; i++) {
        cells[randomPositions[i]] = {
            state: "ALIVE",
            player: 0
        };
    }
    for(let i=6; i<12; i++) {
        cells[randomPositions[i]] = {
            state: "ALIVE",
            player: 1
        };
    }
    for(let i=12; i<22; i++) {
        cells[randomPositions[i]] = {
            state: "DEAD"
        };
    }
    for(let i=22; i<25; i++) {
        cells[randomPositions[i]] = {
            state: "VOID"
        };
    }
    return {
        cells: cells
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getWinner(cells) {
    let firstPlayerDead = isPlayerDead(cells, 0);
    let secondPlayerDead = isPlayerDead(cells, 1);
    if(firstPlayerDead) {
        return 1;
    } else if(secondPlayerDead) {
        return 0;
    }
}

function isDraw(cells) {
    let firstPlayerDead = isPlayerDead(cells, 0);
    let secondPlayerDead = isPlayerDead(cells, 1);
    return firstPlayerDead && secondPlayerDead;
}

function isPlayerDead(cells, playerId) {
    return cells.filter(c => c.state === "ALIVE" && c.player === playerId).length === 0
}
