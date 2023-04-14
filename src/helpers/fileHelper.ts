import { NestedAssets, PostAsset } from "@declarations/file_manager/file_manager.did";

// TODO: Clean up this function
export function handleFileInputFromEvent(event: React.ChangeEvent<HTMLInputElement>): NestedAssets[] {
  console.log(event);
  const target_files = event.target.files;
  if (target_files) {
    const files = Object.values(target_files);
    const mappedFiles = mapfilesToAssets(files);

    // is a single selected file
    if (mappedFiles.length === 1 && files[0].webkitRelativePath === "") {
      const asset: NestedAssets = {
        asset: {
          File: mappedFiles[0].fileAsset.File,
        },
        children: [],
      };
      return [asset];
    } else {
      const dirs = getDirsFromFiles(files);

      let uniqueDirs: { pathSections: string[]; paths: string[] }[] = [];

      dirs.forEach((dir) => {
        const existing = uniqueDirs.find((d) => d.pathSections.join("/") === dir.pathSections.join("/"));
        if (existing) {
          dir.path && existing.paths.push(dir.path);
        } else {
          uniqueDirs.push({
            paths: dir.path ? [dir.path] : [],
            pathSections: dir.pathSections,
          });
        }
      });
      console.log(uniqueDirs);

      // move folder to corresponding parent folder using NestedArray
      const assets: NestedAssets[] = [];
      uniqueDirs.forEach((dir) => {
        let current = assets;
        dir.pathSections.forEach((folder) => {
          const existing = current.find((d) => {
            if ("Directory" in d.asset) {
              return d.asset.Directory.name === folder;
            }
          });
          if (existing) {
            current = existing.children;
          } else {
            const newFolder: NestedAssets = {
              asset: {
                Directory: {
                  name: folder,
                  permission: {
                    Public: null,
                  },
                  parent_id: null!,
                },
              },
              children: [],
            };
            current.push(newFolder);
            current = newFolder.children;
          }
        });
        dir.paths.forEach((path) => {
          const fileAsset = mappedFiles.find((f) => f.path === path);
          if (fileAsset) {
            current.push({ asset: { File: fileAsset.fileAsset.File }, children: [] });
          }
        });
      });

      return assets;
    }
  }
  return [];
}

export async function getFileChunks(file: File) {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  let payload = Array.from(uint8Array);

  let chunks: { bytes: number[] }[] = [];
  const chunkSize = 1_000_000; // size in bytes

  for (let i = 0; i < payload.length; i += chunkSize) {
    chunks.push({
      bytes: payload.slice(i, i + chunkSize),
    });
  }

  return chunks;
}

export function getFileChunkCount(file: File) {
  let chunks = 0;
  const chunkSize = 1_000_000; // size in bytes

  for (let i = 0; i < file.size; i += chunkSize) {
    chunks++;
  }

  return chunks;
}

export function mapfilesToAssets(files: File[]) {
  return files.map((f) => {
    const splitted_name = f.name.split(".");
    let extension = splitted_name[splitted_name.length - 1];
    const path = f.webkitRelativePath;

    const fileAsset: PostAsset = {
      File: {
        name: f.name,
        extension,
        size: BigInt(f.size),
        permission: {
          Public: null,
        },
        parent_id: null!,
        chunk_count: BigInt(getFileChunkCount(f)),
        metadata: null!,
        mime_type: f.type,
        _origin_path: path,
      },
    };

    return { fileAsset, path };
  });
}

export function getDirsFromFiles(files: File[]) {
  return files.map((file) => {
    const path = file.webkitRelativePath;
    const pathSections = path.split("/");
    pathSections.pop();
    return { pathSections, path };
  });
}
