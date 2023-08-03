import { Square } from "./square";

export type SpecialSquareType = 'highlight' | 'emphasis';


interface BoardProps {
    selectedSquare?: [number, number] | null; // [x, y]
    squares: string[][]; // 2D Matrix of pieces
    onSquareClick: (xPos: number, yPos: number) => void;
    specialSquares?: {[key: string]: [number,number][]}; // [x, y]
    playerPiece?: 'w' | 'b';
}

const Board: React.FC<BoardProps> = ({ squares, onSquareClick, selectedSquare, specialSquares, playerPiece = 'w' }) => {
    const boardStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 50px)',
        gridTemplateRows: 'repeat(8, 50px)',
    }
    
    const sqaureToDisplay = playerPiece === 'w'? squares : squares.slice().reverse();
    return (
        <div style={boardStyle}>
            {sqaureToDisplay.map((row, yIndex) => {
                return row.map((piece, xIndex) => {

                    // if (!specialSquares && selectedSquare) {
                    //     specialSquares = {'highlight': [selectedSquare]};
                    // } else if (!specialSquares) {
                    //     specialSquares = {};
                    // }

                    const trueXIndex = xIndex;
                    const trueYIndex = playerPiece === 'w'? yIndex : 7 - yIndex;

                    let squareColor: 'light' | 'dark' | 'highlight' | 'emphasis' = ((trueXIndex + trueYIndex) % 2 === 0 ? 'light' : 'dark');
                    // let isSpecialSquare = false;

                    if (specialSquares) {
                        for (const [key, value] of Object.entries(specialSquares)) {
                            if (value.some((square) => square[0] === trueXIndex && square[1] === trueYIndex)) {
                                // if the square is in the special squares
                                // set the color
    
                                // TODO: type check if key if a special square type
                                squareColor = key as SpecialSquareType;
                                // isSpecialSquare = true;
                            }
                        }
                    }
                    

                    // const shouldHighLight = (selectedSquare || specialSquares.any) && selectedSquare[0] === xIndex && selectedSquare[1] === yIndex;
                    // determine square color

                    // const squareColor = isSpecialSquare ? 'highlight' :  ((xIndex + yIndex) % 2 === 0 ? 'light' : 'dark');
                    return <Square key={`${trueXIndex}-${trueYIndex}`} piece={piece} color={squareColor} onClick={() => onSquareClick(trueXIndex, trueYIndex)} xPos={trueXIndex} yPos={trueYIndex} />
                })
            })}
        </div>
    )
}

export default Board;