import { create } from "zustand";
import { MutableRefObject } from "react";

interface ElementStore {
    menuOptionRef: MutableRefObject<HTMLDivElement | null> | null;
    setMenuOptionRef: (ref: MutableRefObject<HTMLDivElement | null>) => void;
}

const useElementStore = create<ElementStore>((set) => ({
    menuOptionRef: null,
    setMenuOptionRef: (ref) => set({ menuOptionRef: ref }),
}));

export default useElementStore;
