/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { combine, devtools, persist } from 'zustand/middleware'
import { storeBears, storeBearsActions } from './storeBears'
import { storeTours, storeToursActions } from './storeTours'
import { storeUI, storeUIActions } from './storeUI'

export const useStore = create(
  devtools(
    persist(
      combine(
        {
          hackedBy: 'Blade'
        },
        (set: any) => ({
          ui: storeUI,
          tours: storeTours,
          example: storeBears,
          ...storeUIActions(set),
          ...storeBearsActions(set),
          ...storeToursActions(set)
        })
      ),
      {
        name: 'vitron-storage'
      }
    )
  )
)
