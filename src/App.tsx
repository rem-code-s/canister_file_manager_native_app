import { Box, ThemeProvider } from "@mui/material";
import Topbar from "@components/Topbar/Topbar";
import ListView from "@components/ListView/ListView";
import { theme } from "@misc/theme";
import Bottombar from "@components/Bottombar/Bottombar";

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ overflow: "hidden" }}>
        <Box sx={{ height: 60 }}>
          <Topbar />
        </Box>
        <Box sx={{ overflow: "scroll", height: "calc(100vh - (60px + 24px))" }}>
          <ListView />
        </Box>
        <Box sx={{ height: 24 }}>
          <Bottombar />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
