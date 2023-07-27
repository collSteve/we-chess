import { CSSProperties } from 'react';
import styles from '~/styles/chess-board.module.css'
import ChessPiece from './chess-piece';

type props = {
    style?: CSSProperties;
    className?: string;
}

export default function ChessBoard({style, className}: props = {}) {
    const piecesTest: string[] = ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'];


    const onPieceClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log(e);
    }


    return (
        <div onClick={onPieceClick} id={styles['green-board-computer']} className={styles['chess-board'] + ` ${className}`} style={style}>
            <svg viewBox="0 0 100 100" className="coordinates">
                <text x="0.75" y="3.5" font-size="2.8" className="coordinate-light">8</text>
                <text x="0.75" y="15.75" font-size="2.8" className="coordinate-dark">7</text>
                <text x="0.75" y="28.25" font-size="2.8" className="coordinate-light">6</text>
                <text x="0.75" y="40.75" font-size="2.8" className="coordinate-dark">5</text>
                <text x="0.75" y="53.25" font-size="2.8" className="coordinate-light">4</text>
                <text x="0.75" y="65.75" font-size="2.8" className="coordinate-dark">3</text>
                <text x="0.75" y="78.25" font-size="2.8" className="coordinate-light">2</text>
                <text x="0.75" y="90.75" font-size="2.8" className="coordinate-dark">1</text>
                <text x="10" y="99" font-size="2.8" className="coordinate-dark">a</text>
                <text x="22.5" y="99" font-size="2.8" className="coordinate-light">b</text>
                <text x="35" y="99" font-size="2.8" className="coordinate-dark">c</text>
                <text x="47.5" y="99" font-size="2.8" className="coordinate-light">d</text>
                <text x="60" y="99" font-size="2.8" className="coordinate-dark">e</text>
                <text x="72.5" y="99" font-size="2.8" className="coordinate-light">f</text>
                <text x="85" y="99" font-size="2.8" className="coordinate-dark">g</text>
                <text x="97.5" y="99" font-size="2.8" className="coordinate-light">h</text>
            </svg>

            {piecesTest.map((piece, index) => {
                return <ChessPiece piece={piece} xIndex={index % 8 +1} yIndex={Math.floor(index/8)+1}/>
                // return <div draggable={true} key={index} className={`${styles.piece} ${styles[piece]}`} style={peiceTransformationStyle(, Math.floor(index/8)+1)}></div >;
            })}
        </div>


    );
}