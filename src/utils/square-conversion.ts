export function chess2Square(chessSquare: string): [number, number] {
    const [file, rank] = chessSquare.split('');
    if (!file || !rank) {
        throw new Error('Invalid chess square');
    }
    const x = file.charCodeAt(0) - 97;
    const y = parseInt(rank) - 1;
    // y index is reversed since chess board is drawn from top to bottom
    return [x, 7 - y];
}