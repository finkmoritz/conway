export const ConwayGame = {
    setup: () => (getInitialState()),

    turn: {
        moveLimit: 1,
    },

    moves: {
        clickCell: (G, ctx, id) => {
            if (G.cells[id] === null) {
                G.cells[id] = parseInt(ctx.currentPlayer);
            } else {
                G.cells[id] = null;
            }
        }
    },

    endIf: (G, ctx) => {
        if (isDraw(G.cells)) {
            return { draw: true };
        }
        const winner = getWinner(G.cells);
        if (winner) {
            return { winner: winner };
        }
    },

    ai: {
        enumerate: (G, ctx) => {
            let moves = [];
            for (let i = 0; i < 25; i++) {
                moves.push({ move: 'clickCell', args: [i] });
            }
            return moves;
        },
    },
};

function getInitialState() {
    const cells = Array(25);
    const randomPositions = [...Array(25).keys()];
    shuffleArray(randomPositions);
    for(let i=0; i<8; i++) {
        cells[randomPositions[i]] = 0;
    }
    for(let i=8; i<16; i++) {
        cells[randomPositions[i]] = 1;
    }
    for(let i=16; i<25; i++) {
        cells[randomPositions[i]] = null;
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
    let firstPlayerDead = cells.filter(c => c === 0).length === 0;
    let secondPlayerDead = cells.filter(c => c === 1).length === 0;
    if(firstPlayerDead) {
        return 1;
    } else if(secondPlayerDead) {
        return 0;
    }
}

function isDraw(cells) {
    let firstPlayerDead = cells.filter(c => c === 0).length === 0;
    let secondPlayerDead = cells.filter(c => c === 1).length === 0;
    return firstPlayerDead && secondPlayerDead;
}
