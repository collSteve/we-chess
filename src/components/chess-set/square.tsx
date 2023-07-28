import Piece from "./piece";

interface SquareProps {
    piece: string;
    color: 'light' | 'dark';
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    xPos: number;
    yPos: number;
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
        backgroundColor: color === 'light' ? '#f0d9b5' : '#b58863',
    };
    return (
        <div onClick={onClick} className={`chess-square ${color}`} style={squareStyle}>
            <Piece piece={piece}></Piece>
        </div>
    )
}