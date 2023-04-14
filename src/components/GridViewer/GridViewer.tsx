import React, { useEffect, useState } from "react";
import { Asset } from "@declarations/file_manager/file_manager.did";
import { truncate } from "src/helpers/stringHelper";

import { Folder, InsertDriveFile } from "@mui/icons-material";
import { Grid, Stack, Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { useGlobal } from "src/context/GlobalContext";

export default function GridViewer() {
  const { assets } = useGlobal();

  function renderAssets() {
    return assets.map((asset, index) => {
      if ("Directory" in asset) {
        return (
          <Grid item key={"dir" + asset.Directory.id} xs={1.5}>
            <Stack spacing={2} alignItems="center">
              <Folder fontSize="large" />
              <Typography>{truncate(asset.Directory.name, 8)}</Typography>
            </Stack>
          </Grid>
        );
      }
      return (
        <Grid item key={"file" + asset.File.id} xs={1.5}>
          <Stack spacing={2} alignItems="center">
            <InsertDriveFile fontSize="large" />
            <Typography sx={{ textOverflow: "ellipsis" }}>
              <Typography>
                {truncate(asset.File.name, 5)}.{asset.File.extension}
              </Typography>
            </Typography>
          </Stack>
        </Grid>
      );
    });
  }

  return (
    <Grid container spacing={2}>
      {renderAssets()}
    </Grid>
  );
}
