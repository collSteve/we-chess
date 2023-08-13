import { Box, Button, Grid, GridItem, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface PlayerInfoInGameBannerProps {
    playerName?: string;
}

const PlayerInfoInGameBanner: React.FC<PlayerInfoInGameBannerProps> = ({ playerName }) => {

    const displayPlayerName = playerName ?? 'Waiting for player';
    return (
        <div style={{ display: "flex", gap: "20px", flexDirection: "row", width: "100%", height: "auto", alignItems: "center" }}>
            <img src="/default_profile.png" alt="" style={{ width: "50px", height: "50px" }} />
            <div>{displayPlayerName}</div>
        </div>
    )
};

export default PlayerInfoInGameBanner;