import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGlobal } from "src/context/GlobalContext";
import Loading from "../Loading/Loading";
import logoLarge from "@assets/logo_large.png";

export default function Topbar() {
  const { isLoading } = useGlobal();
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Box
      sx={{
        pl: 2,
        pr: 1,
        alignItems: "center",
        justifyContent: "space-between",
        display: "flex",
        flexGrow: 1,
        height: "100%",
        background: (theme) => theme.palette.primary.light,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", pt: 0.5 }}>
        <img height={32} alt="rem.codes" src={logoLarge} />
        <Typography sx={{ mt: -0.9 }} variant="caption">
          Canister file manager
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>{isLoading && <Loading />}</Box>
    </Box>
  );
}
