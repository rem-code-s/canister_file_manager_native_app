import React from "react";
import LoadingIndicator from "@assets/loading.gif";
import { Box, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        background: "#ffffff",
        borderRadius: "50%",
        height: 32,
        width: 32,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img width={32} height={32} src={LoadingIndicator} />
    </Box>
  );
}
