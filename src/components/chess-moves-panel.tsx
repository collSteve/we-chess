import { useState } from "react";

interface ChessMovePanelProps {
    moves: string[];
    onMoveClick: (moveIndex: number) => void;
}

const ChessMovePanel: React.FC<ChessMovePanelProps> = ({ moves, onMoveClick }) => {
    const [selectedMoveIndex, setSelectedMoveIndex] = useState<number>(0);

    const handleMoveClick = (moveIndex: number) => {
        setSelectedMoveIndex(moveIndex);
        onMoveClick(moveIndex);
    }

    return (
        <div className="chess-moves-panel">
            {moves.map((move, index) => {
                return <div key={index} onClick={() => handleMoveClick(index)} style={{color: selectedMoveIndex==index ? 'var(--color-orange-100)': 'black'}}>{move}</div>
            })}
        </div>
    )
};

export default ChessMovePanel;