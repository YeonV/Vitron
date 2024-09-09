/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer'

export const storeUI = (set: any) => ({
  darkMode: false,
  setDarkMode: (dark: boolean): void =>
    set(
      produce((state: any) => {
        state.ui.darkMode = dark
      }),
      false,
      'ui/darkmode'
    )
})
