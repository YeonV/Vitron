import create from "zustand";
import { combine } from 'zustand/middleware'
import { storeBears, storeBearsB } from "./storeBears";
// import { storeBears, storeBearsB, storeBearsC } from "./storeBears";

export const useStore = create(
  combine(
    {
      ...storeBears,
      // ...storeBearsC
    },
    storeBearsB,
  ),
)

