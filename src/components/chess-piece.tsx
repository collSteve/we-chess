import styles from '~/styles/chess-board.module.css'

/**
 * 
 * @param x horizontal position of piece: from 1 to 8
 * @param y vertical position of piece: from 1 to 8
 */
function peiceTransformationStyle(x: number, y: number) {
    return {
        transform: `translate(${(x - 1) * 100}%, ${(y - 1) * 100}%)`
    }
}

type props = { 
    xIndex: number;
    yIndex: number;
    piece: string;
};


export default function ChessPiece({xIndex, yIndex, piece}: props) {
    return (
        <div draggable={true} key={`${xIndex}-${yIndex}`} className={`${styles.piece} ${styles[piece]}`} style={peiceTransformationStyle(xIndex, yIndex)}></div >
    );
}