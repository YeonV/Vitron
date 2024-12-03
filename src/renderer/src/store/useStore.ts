/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { combine, devtools, persist } from 'zustand/middleware'
import { storeBears } from './storeBears'
import { storeTours } from './storeTours'
import { storeUI } from './storeUI'

export const useStore = create(
  devtools(
    persist(
      combine(
        {
          hackedBy: 'Blade'
        },
        (set: any) => ({
          ui: storeUI(set),
          tours: storeTours(set),
          example: storeBears(set)
        })
      ),
      {
        name: 'vitron-storage'
      }
    )
  )
)
