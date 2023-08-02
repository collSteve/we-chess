import { Button, Grid, GridItem, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface ChessMovePanelProps {
    moves: string[];
    onMoveClick: (moveIndex: number) => void;
    moveIndex: number;
}

const ChessMovePanel: React.FC<ChessMovePanelProps> = ({ moves, onMoveClick, moveIndex }) => {

    return (
        <div className="chess-moves-panel">
            <Grid gap={0} templateColumns='repeat(2, 50%)'>
                {moves.map((move, index) => {
                    return <GridItem key={index}>
                        <Button
                            key={index}
                            colorScheme={moveIndex == index ? "teal" : undefined}
                            onClick={() => onMoveClick(index)}
                            variant='ghost'
                        >
                            {move}
                        </Button>
                    </GridItem>
                })}
            </Grid>
        </div>
    )
};

export default ChessMovePanel;