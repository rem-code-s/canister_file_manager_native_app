import { Box, Typography } from "@mui/material";
import { useGlobal } from "src/context/GlobalContext";

const trillion = 1_000_000_000_000;
const megabyte = 1_000_000;

export default function Bottombar() {
  const { metadata } = useGlobal();

  function readableCycles() {
    if (metadata?.cycles) {
      const calculated = Number(metadata.cycles) / trillion;
      return calculated.toFixed(2) + "T cycles";
    }
    return "0T cycles";
  }

  function readableBytes() {
    if (metadata?.heap_memory) {
      const calculated = Number(metadata.files_combined_bytes) / megabyte;
      return calculated.toFixed(2) + "MB";
    }
    return "0MB";
  }

  return (
    <Box
      sx={{
        px: 2,
        alignItems: "center",
        justifyContent: "end",
        display: "flex",
        flexGrow: 1,
        height: "100%",
        background: (theme) => theme.palette.primary.light,
      }}
    >
      <Typography variant="caption">
        {readableCycles()} | {readableBytes()} | {Number(metadata?.file_count)} files |{" "}
        {Number(metadata?.directory_count)} directories
      </Typography>
    </Box>
  );
}
