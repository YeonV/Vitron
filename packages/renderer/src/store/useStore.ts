import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { combine } from 'zustand/middleware';
import { storeBears, storeBearsB } from './storeBears';
// import { storeBears, storeBearsB, storeBearsC } from "./storeBears";

export const useStore = create(
  devtools(
    combine(
      {
        ...storeBears,
        // ...storeBearsC
      },
      storeBearsB
    )
  )
);
