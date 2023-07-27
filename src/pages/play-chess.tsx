import { CSSProperties } from "react";
import ChessBoard from "~/components/chess-board";

export default function PlayChessPage() {
    return (
        <ChessBoard style={{width: '500px', height: '500px'}} ></ChessBoard>
    );
}