import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { combine } from 'zustand/middleware';
import { storeBears, storeBearsActions, } from './storeBears';
import { storeUI, storeUIActions } from './storeUI';

// export const useStore = create(
//   devtools(
//     combine(
//       {
//         ...storeBears,
//         ...storeUI
//       },
//       storeUIActions
//       // cannot add storeBearsAction here
//     )
//   )
// );

export const useStore = create(((set) => ({  
  ...storeBearsActions(set),
  ...storeBears,
  
  ...storeUIActions(set),
  ...storeUI,
})))