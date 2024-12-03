/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer'

export const storeUI = {
  darkMode: false
}

export const storeUIActions = (set: any) => ({
  setDarkMode: (dark: boolean): void =>
    set(
      produce((state: any) => {
        state.ui.darkMode = dark
      }),
      false,
      'ui/darkmode'
    )
})
