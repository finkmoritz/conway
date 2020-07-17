import React from 'react';
import './styles/board.css';

export class ConwayBoard extends React.Component {
    onClick(id) {
        this.props.moves.clickCell(id);
    }

    render() {
        let winner = '';
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner">Draw!</div>
                );
        }

        let tbody = [];
        for (let i = 0; i < 5; i++) {
            let cells = [];
            for (let j = 0; j < 5; j++) {
                const id = 5 * i + j;
                switch (this.props.G.cells[id].state) {
                    case "VOID":
                        cells.push(
                            <td key={id}/>
                        );
                        break;
                    case "DEAD":
                        cells.push(
                            <td className="dead cell" key={id} onClick={() => this.onClick(id)}/>
                        );
                        break;
                    case "ALIVE":
                        cells.push(
                            <td className="alive cell" key={id} onClick={() => this.onClick(id)}>
                                {this.props.G.cells[id].player}
                            </td>
                        );
                        break;
                    default:
                        console.error("Unknown state: "+this.props.G.cells[id].state);
                }
            }
            tbody.push(<tr key={i}>{cells}</tr>);
        }

        return (
            <div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
                {winner}
            </div>
        );
    }
}
