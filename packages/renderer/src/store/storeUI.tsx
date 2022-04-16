// import produce from 'immer'

export const storeUI = { 
  darkMode: false,
}

export const storeUIActions = (set:any) => ({
  setDarkMode: (dark: boolean):void => set((state:any) => ({ darkMode: dark }), false, "ui/darkmode"),    
})
