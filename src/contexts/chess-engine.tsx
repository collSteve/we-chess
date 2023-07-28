import { createContext, useContext, useState } from "react";

interface ChessEngineContextProps {
    children: React.ReactNode;
}

const ChessEngineContext = createContext<ChessEngineContextProps>({} as ChessEngineContextProps);

export const useChessEngine = () => useContext(ChessEngineContext);

// export const ChessEngineProvider: React.FC<ChessEngineContextProps> = ({ children }) => {
//     const [chessEngine, setChessEngine] = useState<ChessEngineContextProps>(new Chess());
// }