import produce from 'immer'

export const storeBears = { 
  animals: { 
    bears: 1
  }
}

export const storeBearsActions = (set:any) => ({ 
  increase: (by: number):void => set(produce((state:any) => { state.animals.bears =  state.animals.bears + by }), false, "bears/increase"),
})
