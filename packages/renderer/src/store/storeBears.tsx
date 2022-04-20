import produce from 'immer'

export const storeBears = (set:any) => ({ 
  animals: { 
    bears: 1
  },
  increase: (by: number):void => set(produce((state:any) => { state.example.animals.bears =  state.example.animals.bears + by }), false, "bears/increase"),
})
