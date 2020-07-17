export const ConwayGame = {
    setup: () => (getInitialState()),

    turn: {
        moveLimit: 1,
        onEnd: iterate,
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

function iterate(G, ctx) {
    const newCells = JSON.parse(JSON.stringify(G.cells));
    for(let i=0; i<G.cells.length; i++) {
        const neighbours = getNeighbours(G.cells, i);
        const nNeighboursAlive = neighbours.filter(cell => cell.state === "ALIVE").length;
        if(G.cells[i].state === "DEAD" && nNeighboursAlive === 3) {
            newCells[i].state = "ALIVE";
            let dominantPlayer = computeDominantPlayer(neighbours);
            if(dominantPlayer !== undefined) {
                newCells[i].player = dominantPlayer;
            } else {
                newCells[i].player = parseInt(ctx.currentPlayer);
            }
        } else if(G.cells[i].state === "ALIVE" && (nNeighboursAlive < 2 || nNeighboursAlive > 3)) {
            newCells[i].state = "DEAD";
            newCells[i].player = undefined;
        }
    }
    G.cells = newCells;
}

function getNeighbours(cells, index) {
    const neighbours = [];
    for(let dx of [-1, 0, 1]) {
        for(let dy of [-1, 0, 1]) {
            if(dx === 0 && dy === 0) {
                continue;
            } else {
                const nbr = getNeighbour(cells, index, dx, dy);
                if(nbr !== undefined) {
                    neighbours.push(nbr);
                }
            }
        }
    }
    return neighbours;
}

function getNeighbour(cells, index, dx, dy) {
    let x = index%5 + dx;
    let y = Math.floor(index/5) + dy;
    if(x >= 0 && x < 5 && y >= 0 && y < 5) {
        return cells[5*y + x];
    }
}

function computeDominantPlayer(neighbours) {
    const playerCount = [0, 0];
    for(let cell of neighbours) {
        if(cell.player !== undefined) {
            playerCount[cell.player]++;
        }
    }
    if(playerCount[0] > playerCount[1]) {
        return 0;
    } else if(playerCount[0] < playerCount[1]) {
        return 1;
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
