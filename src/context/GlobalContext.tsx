import { Asset, Metadata } from "@declarations/file_manager/file_manager.did";
import { Methods } from "@misc/methods";
import { invoke } from "@tauri-apps/api";
import React, { PropsWithChildren, createContext, useContext, useEffect } from "react";

interface IGlobalContext {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  assets: Asset[];
  getAssets: (parentId: bigint | null) => void;
  metadata: Metadata | null;
  principal: string | null;
}

export const GlobalContextValue = createContext<IGlobalContext>({
  assets: [],
  isLoading: false,
  setIsLoading: () => {},
  getAssets: () => {},
  metadata: null,
  principal: null,
});

export default function GlobalContextProvider({ children }: PropsWithChildren<{}>) {
  const [state, setState] = React.useState<IGlobalContext>({
    assets: [],
    isLoading: false,
    setIsLoading,
    getAssets,
    metadata: null,
    principal: null,
  });

  useEffect(() => {
    getAssets();
  }, []);

  function setIsLoading(isLoading: boolean) {
    setState((prevState) => ({ ...prevState, isLoading }));
  }

  async function getAssets(parentId: bigint | null = null) {
    try {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      let result: Asset[] = await invoke(Methods.getAssetTree, { parentId });
      const metadata: Metadata = await invoke(Methods.getMetadata);
      const principal: string = await invoke(Methods.getPrincipal);

      // TODO:
      // set state correctly so it merges from the new parent
      // keep folder in view, currently everything collapses when setting the new state
      setState((prevState) => {
        return { ...prevState, assets: result, isLoading: false, metadata, principal };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  return <GlobalContextValue.Provider value={state}>{children}</GlobalContextValue.Provider>;
}

export function useGlobal() {
  return useContext(GlobalContextValue);
}
