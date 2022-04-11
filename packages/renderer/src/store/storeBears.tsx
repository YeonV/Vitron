import produce from 'immer'

export const storeBears = { bears: 0, outer: { inner: 1} }

// export const storeBearsC = { bearsc: 0, yzc: { nestc: 1} }

export const storeBearsB = (set:any) => ({ 
    increase: (by: number):void => set(produce((state:any) => { state.outer.inner =  state.outer.inner + by }), false, "inner/increase"),
    increaseBear: (by: number):void => set((state:any) => ({ bears: state.bears + by }), false, "bear/increase")
  })
