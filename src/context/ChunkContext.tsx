import React, { PropsWithChildren, createContext, useContext } from "react";

interface IFileData {
  file: File;
  parentId: bigint | null;
}

interface IGlobalContext {
  files: IFileData[];
  setFiles: (files: IFileData[]) => void;
}

export const ChunkContextValue = createContext<IGlobalContext>({
  files: [],
  setFiles: () => {},
});

export default function ChunkContextProvider({ children }: PropsWithChildren<{}>) {
  const [state, setState] = React.useState<IGlobalContext>({
    files: [],
    setFiles,
  });

  function setFiles(files: IFileData[]) {
    setState((prevState) => ({ ...prevState, files }));
  }

  return <ChunkContextValue.Provider value={state}>{children}</ChunkContextValue.Provider>;
}

export function useChunk() {
  return useContext(ChunkContextValue);
}
