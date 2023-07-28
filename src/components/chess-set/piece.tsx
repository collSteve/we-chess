import { REGULAR_CHESS_PIECE_ASSET } from "~/utils/consts/chess-piece-asset";

interface PieceProps {
    piece: string;
}

const Piece: React.FC<PieceProps> = ({ piece }) => {
    const pieceStyle: React.CSSProperties = {
        backgroundImage: `url(${REGULAR_CHESS_PIECE_ASSET[piece]})`,
        backgroundSize: '100%',
        height: '100%',
        width: '100%',
        left: '0',
        top: '0',
        // overflow: 'hidden',
        // position: 'absolute',
        touchAction: 'none',
    }
    return (
        <div className="chess-piece" style={pieceStyle}></div>
    );
}

export default Piece;