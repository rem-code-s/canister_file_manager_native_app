import React, { useEffect, useRef, useState } from "react";
import { Asset, DirectoryResponse } from "@declarations/file_manager/file_manager.did";
import {
  Add,
  ChevronRight,
  CreateNewFolder,
  Delete,
  Folder,
  FolderOpen,
  InsertDriveFile,
  MoreHoriz,
  PlusOne,
} from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import { useGlobal } from "src/context/GlobalContext";
import { truncate } from "src/helpers/stringHelper";
import Loading from "@components/Loading/Loading";
import { handleFileInputFromEvent } from "@helpers/fileHelper";
import { invoke } from "@tauri-apps/api";
import { useChunk } from "src/context/ChunkContext";
import { Methods } from "@misc/methods";

interface IRow {
  parentId: bigint | null;
  parentName: string;
  assets: Asset[];
}

export default function ListView() {
  const { assets, setIsLoading, getAssets, principal } = useGlobal();
  const [rows, setRows] = useState<{ [row: number]: IRow }>({});
  const listRef = useRef<HTMLUListElement | null>(null);
  const [listMenuAnchorEl, setListMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [assetMenuAnchorEl, setAssetMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<bigint | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<{ id: bigint | null; method: Methods }>({
    id: null,
    method: Methods.deleteFile,
  });

  useEffect(() => {
    setRows({ [0]: { parentId: null, parentName: "", assets: assets } });
  }, [assets]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [rows]);

  function handleDirectoryClick(row: number, directory: DirectoryResponse) {
    setRows((prevState) => {
      // filter out all rows that are higher then row + 1
      Object.keys(prevState).forEach((key) => {
        if (Number(key) > row + 1) {
          delete prevState[Number(key)];
        }
      });
      return {
        ...prevState,
        [row + 1]: { parentId: directory.id, parentName: directory.name, assets: directory.children },
      };
    });
  }

  async function handleInvoke(method: Methods, id: bigint | null) {
    console.log(method, id);
    setListMenuAnchorEl(null);
    setAssetMenuAnchorEl(null);
    try {
      setIsLoading(true);
      await invoke(method, { id });
      await getAssets(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderRowMenu() {
    return (
      <Menu anchorEl={listMenuAnchorEl} open={Boolean(listMenuAnchorEl)} onClose={() => setListMenuAnchorEl(null)}>
        <MenuItem onClick={() => handleInvoke(Methods.selectFiles, selectedRowId)}>
          <ListItemIcon>
            <InsertDriveFile />
          </ListItemIcon>
          Upload files
        </MenuItem>
        <MenuItem onClick={() => handleInvoke(Methods.selectDirectories, selectedRowId)}>
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          Upload folder
        </MenuItem>
      </Menu>
    );
  }

  async function handleAssetMenuButtonClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: bigint,
    method: Methods
  ) {
    event.stopPropagation();
    setAssetMenuAnchorEl(event.currentTarget);
    setSelectedAssetId({ id, method });
  }

  function renderAssetMenu() {
    return (
      <Menu
        sx={{ margin: 0, padding: 0 }}
        anchorEl={assetMenuAnchorEl}
        open={Boolean(assetMenuAnchorEl)}
        onClose={() => setAssetMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => handleInvoke(selectedAssetId.method, selectedAssetId.id)}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    );
  }

  function renderAssets(rowData: IRow, row: number) {
    return rowData.assets.map((asset) => {
      if ("Directory" in asset) {
        const isSelected = Object.values(rows).some((r) => r.parentId === asset.Directory.id);
        const owned = principal === asset.Directory.owner.toString();
        return (
          <ListItemButton
            sx={isSelected ? { bgcolor: "secondary.dark" } : { opacity: owned ? 1 : 0.4 }}
            onClick={(e) => handleDirectoryClick(row, asset.Directory)}
            divider
            key={"dir" + asset.Directory.id}
          >
            <ListItemIcon>
              <Folder sx={!isSelected ? { color: (theme) => theme.palette.primary.main } : { color: "white" }} />
            </ListItemIcon>
            <ListItemText primary={asset.Directory.name} />
            <ListItemSecondaryAction sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                sx={
                  isSelected
                    ? { background: "#ffffff", color: (theme) => theme.palette.primary.main }
                    : { color: "#ffffff" }
                }
              >
                <ChevronRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItemButton>
        );
      }
      const owned = principal === asset.File.owner.toString();
      return (
        <ListItemButton
          sx={{ opacity: owned ? 1 : 0.4 }}
          // disabled={asset.File.chunks.some((c) => processingChunks.some((p) => p === c))}
          divider
          key={"file" + asset.File.id}
          // onClick={() => setSelectedFile(asset.File)}
        >
          <ListItemIcon>
            {["gif", "jpg", "jpeg", "png", "svg", "webp", "ico"].includes(asset.File.extension) ? (
              <img alt={asset.File.name} width={24} src={window.location.href + asset.File.path} />
            ) : (
              <InsertDriveFile color="primary" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={truncate(asset.File.name.split("." + asset.File.extension)[0], 10) + "." + asset.File.extension}
          />
        </ListItemButton>
      );
    });
  }

  return (
    <>
      {renderRowMenu()}
      {renderAssetMenu()}
      <Stack direction="row" display={"flex"} height="100%">
        {Object.entries(rows).map(([row_id, row_data]) => (
          <List
            disablePadding
            ref={listRef}
            sx={{ overflowY: "auto", borderRight: "1px solid rgba(0, 0, 0, 0.12)", minWidth: 250, maxWidth: 250 }}
            key={row_id}
          >
            <ListItemButton
              disabled
              component="label"
              divider
              sx={{ justifyContent: "center" }}
              onClick={(e) => {
                setSelectedRowId(row_data.parentId);
                setListMenuAnchorEl(e.currentTarget);
              }}
            >
              <Add color="secondary" />
            </ListItemButton>
            {renderAssets(row_data, Number(row_id))}
          </List>
        ))}
      </Stack>
    </>
  );
}
