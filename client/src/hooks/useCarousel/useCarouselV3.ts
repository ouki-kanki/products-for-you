import { useReducer, Reducer, useEffect } from "react";
import { ICarouselState } from './carouselTypes';

const enum CarouselTypes {
  JUMP,
  NEXT,
  PREV,
  DONE,
  DRAG,
  ADD_OFFSET
}

type ICarouselAction = 
  | { type: CarouselTypes.JUMP,  desired: number }
  | { type: CarouselTypes.NEXT,  numOfItems: number }
  | { type: CarouselTypes.PREV,  numOfItems: number }
  | { type: CarouselTypes.DRAG,  offset: number }
  | { type: CarouselTypes.DONE }
  | { type: CarouselTypes.ADD_OFFSET, offset: number }


const initialState = (active: number): ICarouselState => {
  return {
    offset: 0,
    desired: 0, // the slide that the user wants
    active 
  }
}

function previous(length: number, current: number) {
  return (current - 1 + length) % length;
}

function next(length: number, current: number) {
  return (current + 1) % length
}

const carouselReducer: Reducer<ICarouselState, ICarouselAction> = (state, action): ICarouselState => {
  switch (action.type) {
    case CarouselTypes.NEXT:
      return {
        ...state,
        active: next(action.numOfItems, state.active)
        // offset to be the same as the width of the item to use for transform
      }
    case CarouselTypes.PREV:
      return {
        ...state,
        active: previous(action.numOfItems, state.active)
      }
    case CarouselTypes.ADD_OFFSET:
      return {
        ...state,
        offset: action.offset
      }
    case CarouselTypes.DONE:
      return {
        ...state,
        offset: 0
      }
    default: 
      return state;
  }
}


export const useCarouselV3 = (numOfItems: number, transitionTime: number, itemWidth: number, activeIndex: number) => {
  const [state, dispatch] = useReducer(carouselReducer, initialState(activeIndex))
  const toNextItem = () => {
    // change the offset asap
    dispatch({ type: CarouselTypes.ADD_OFFSET, offset: -(itemWidth) })
    setTimeout(() => {
      dispatch({ type: CarouselTypes.NEXT, numOfItems })
    }, transitionTime)

    setTimeout(() => {
      dispatch({ type: CarouselTypes.DONE })
    }, transitionTime); 
  }

  const toPrevItem = () => {
    dispatch({ type: CarouselTypes.ADD_OFFSET, offset: (itemWidth) })
    dispatch({ type: CarouselTypes.PREV, numOfItems })

    setTimeout(() => {
      dispatch({ type: CarouselTypes.DONE })
    }, transitionTime); 
  }



  return {
    toNextItem,
    toPrevItem,
    active: state.active,
    offset: state.offset
  }
}