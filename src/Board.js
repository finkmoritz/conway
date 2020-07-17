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
            const cells = [];
            for (let j = 0; j < 5; j++) {
                const id = 5 * i + j;
                let className = "";
                let innerText = "";
                switch (this.props.G.cells[id].state) {
                    case "DEAD":
                        className = "dead cell";
                        break;
                    case "ALIVE":
                        className = "alive cell";
                        innerText = this.props.G.cells[id].player;
                        break;
                    default:
                }
                if(this.props.G.lastClicked === id) {
                    className = "clicked " + className;
                }
                if(className === "") {
                    cells.push(
                        <td key={id}/>
                    );
                } else {
                    cells.push(
                        <td className={className} key={id} onClick={() => this.onClick(id)}>
                            {innerText}
                        </td>
                    );
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
