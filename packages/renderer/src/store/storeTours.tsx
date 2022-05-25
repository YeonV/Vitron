import produce from 'immer'

export const storeTours = (set:any) => ({  
  home: false,
  setTour: (tour:string, open:boolean):void => set(
    produce((state:any) => { state.tours[tour] = open }), false, "ui/setTour"
  ),
})
