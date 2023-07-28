import { Square } from "./square";

interface BoardProps {
    squares: string[][]; // 2D Matrix of pieces
    onSquareClick: (xPos: number, yPos: number) => void;
}

const Board: React.FC<BoardProps> = ({ squares, onSquareClick }) => {
    const boardStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 50px)',
        gridTemplateRows: 'repeat(8, 50px)',
    }
    return (
        <div style={boardStyle}>
            {squares.map((row, yIndex) => {
                return row.map((piece, xIndex) => {
                    return <Square key={`${xIndex}-${yIndex}`} piece={piece} color={(xIndex + yIndex) % 2 === 0 ? 'light' : 'dark'} onClick={() => onSquareClick(xIndex, yIndex)} xPos={xIndex} yPos={yIndex} />
                })
            })}
        </div>
    )
}

export default Board;