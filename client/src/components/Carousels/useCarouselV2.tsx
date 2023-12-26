import { useReducer, useEffect, useState } from 'react';
import { useSwipeable, SwipeableHandlers } from 'react-swipeable';


const enum CarouselTypes {
  NEXT,
  PREV,
  DONE,
  JUMP
}

export type ICarouselAction = 
  | { type: CarouselTypes.JUMP,  desired: number }
  | { type: CarouselTypes.NEXT,  length: number }
  | { type: CarouselTypes.PREV,  length: number }
  // | { type: CarouselTypes.DRAG,  offset: number }
  | { type: CarouselTypes.DONE }



interface ICarouselState {
  active: number
}

const initialState: ICarouselState = {
  active: 0
}

function previous(length: number, current: number) {
  return (current - 1 + length) % length;
}

function next(length: number, current: number) {
  return (current + 1) % length;
}

const carouselReducer = (state: ICarouselState, action: ICarouselAction) => {
  switch(action.type) {
    case CarouselTypes.NEXT:
      return {
        ...state,
        active: next(action.length, state.active)
      }
    case CarouselTypes.PREV:
      return {
        ...state,
        active: previous(action.length, state.active)
      }
    default:
      return state
  }
}

export const useCarouselV2 = (length) => {
  const [state, dispatch] = useReducer(carouselReducer, initialState)

  const moveRight = () => {
    dispatch({ type: CarouselTypes.NEXT, length })
  }

  const moveLeft = () => {
    dispatch({ type: CarouselTypes.PREV, length })
  }

  return {
    moveRight,
    moveLeft,
    active: state.active
  }
}