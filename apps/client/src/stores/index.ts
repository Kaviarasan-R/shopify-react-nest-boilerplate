import { create } from "zustand";

const store = (set: any) => ({
  embedded: "0",
  shop: "",
  host: "",
  changeEmbedded: (newEmbedded: any) =>
    set((state: { embedded: any }) => ({
      ...state,
      embedded: newEmbedded,
    })),
  changeShop: (newShop: any) =>
    set((state: { shop: any }) => ({
      ...state,
      shop: newShop,
    })),
  changeHost: (newHost: any) =>
    set((state: { host: any }) => ({
      ...state,
      host: newHost,
    })),
});

export const useStore = create(store);
