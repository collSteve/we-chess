import Piece from "./piece";

interface SquareProps {
    piece: string;
    color: 'light' | 'dark' | 'highlight' | 'emphasis';
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    xPos: number;
    yPos: number;
}

const squareColor = {
    light: '#f0d9b5',
    dark: '#b58863',
    highlight: 'yellow',
    'emphasis': 'red'
}

export const Square: React.FC<SquareProps> = ({ piece, color, onClick, xPos, yPos }) => {
    const squareStyle: React.CSSProperties = {
        backgroundSize: '100%',
        // height: '12.5%',
        // width: '12.5%',
        left: '0',
        top: '0',
        // overflow: 'hidden',
        // position: 'absolute',
        touchAction: 'none',
        backgroundColor: squareColor[color],
    };
    return (
        <div onClick={onClick} className={`chess-square ${color}`} style={squareStyle}>
            <Piece piece={piece}></Piece>
        </div>
    )
}