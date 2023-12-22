import { useState, useReducer, Reducer, useEffect } from 'react';
import { useSwipeable, SwipeableHandlers } from 'react-swipeable';

import { CarouselTypes } from './carouselTypes';
import type {ICarouselState, ICarouselAction, IConfig, ICarouselOptions } from "./carouselTypes";

import {
  DEFAULT_INTERVAL,
  DEFAULT_LENGTH,
  DEFAULT_TRANSITION_TIME,
  DEFAULT_OPTIONS,
  THRESHOLD,
  LIMIT,
  ELASTIC,
  SMOOTH
} from './carouselData'


const initialState: ICarouselState = {
  offset: 0,
  desired: 0, // the slide that the user wants
  active: 0
}

function previous(length: number, current: number) {
  return (current - 1 + length) % length;
}

function next(length: number, current: number) {
  return (current + 1) % length
}

const carouselReducer: Reducer<ICarouselState, ICarouselAction > = (state, action): ICarouselState => {
  switch (action.type) {
    case CarouselTypes.JUMP:
      return {
        ...state,
        desired: action.desired
      };
    case CarouselTypes.NEXT:
      return {
        ...state,
        desired: next(action.length, state.active)
      };
    case CarouselTypes.PREV:
      return {
        ...state,
        desired: previous(action.length, state.active)
      }
    case CarouselTypes.DONE:
      return {
        ...state,
        offset: NaN,
        active: state.desired
      }
    case CarouselTypes.DRAG:
      return {
        ...state,
        offset: action.offset
      }
    default:
      return state;
  }
}

// for touch devices
function swiped(
  delta: number,
  dispatch: React.Dispatch<ICarouselAction>,
  length: number,
  dir: 1 | -1,
  container: HTMLElement,
) {
  const t = container.clientWidth * THRESHOLD;
  const d = dir * delta;

  if (d >= t) {
    dispatch(dir > 0 ? { type: CarouselTypes.NEXT, length } : { type: CarouselTypes.PREV, length });
  } else {
    dispatch({
      type: CarouselTypes.DRAG,
      offset: 0,
    });
  }
}


// ------- HOOK ----------
export const useCarousel = (config: IConfig = {}): [number, (n: number) => void, SwipeableHandlers, React.CSSProperties] => {
  const [state, dispatch] = useReducer (carouselReducer, initialState)
  const [container, setContainer] = useState(undefined)
  
  const { length: customLength, 
    interval: customInterval,
    transitionTime: customTransitionTime,
    options: customOptions
  } = config
  
  const length = customLength || DEFAULT_LENGTH
  const interval = customInterval || DEFAULT_INTERVAL
  const transitionTime = customTransitionTime || DEFAULT_TRANSITION_TIME
  
  // TODO: FIX THE TYPES HERE 
  const slidesPresented = customOptions && customOptions.slidesPresented !== undefined
  ? customOptions.slidesPresented!
  : DEFAULT_OPTIONS.slidesPresented!;

  const shadowSlides = 2 * slidesPresented ;
  // always bigger than 1 
  const n = Math.max(1, Math.min(slidesPresented, length))
  const totalWidth = 100 / n

  // debugger;

  // handle touchscreens
  const { ref, onMouseDown } = useSwipeable({
    onSwiping(e) {
      const sign = e.deltaX > 0 ? -1 : 1;
      dispatch({
        type: CarouselTypes.DRAG,
        offset: sign * Math.min(Math.abs(e.deltaX), LIMIT * container.clientWidth),
      });
    },
    onSwipedLeft(e) {
      swiped(e.deltaX, dispatch, length, 1, container);
    },
    onSwipedRight(e) {
      swiped(e.deltaX, dispatch, length, -1, container);
    },
    trackMouse: true,
    trackTouch: true,
  });
  const handlers = {
    onMouseDown,
    ref(container: HTMLElement) {
      setContainer(container && container.firstElementChild);
      return ref(container);
    },
  };

  // AUTO ROTATION
  useEffect(() => {
    // Todo: INTERVAL & LENGTH
    const id = setTimeout(() => dispatch({ type: CarouselTypes.NEXT,  length }), interval)

    return () => clearTimeout(id)
  }, [state.offset, state.active, length, interval])

  useEffect(() => {
    const id = setTimeout(() => dispatch({ type: CarouselTypes.DONE }), transitionTime)

    return () => clearTimeout(id)
  }, [state.desired, transitionTime])

  const style: React.CSSProperties = {
    transform: 'translateX(0)',
    width: `${totalWidth * (length + shadowSlides)}%`,
    left: `-${(state.active + 1) * totalWidth}%`,
  };

  if (state.desired !== state.active) {
    const dist = Math.abs(state.active - state.desired);
    const pref = Math.sign(state.offset || 0);
    const dir = (dist > length / 2 ? 1 : -1) * Math.sign(state.desired - state.active);
    const shift = (totalWidth * (pref || dir)) / (length + shadowSlides);
    style.transition = SMOOTH;
    style.transform = `translateX(${shift}%)`;
  } else if (!isNaN(state.offset)) {
    if (state.offset !== 0) {
      style.transform = `translateX(${state.offset}px)`;
    } else {
      style.transition = ELASTIC;
    }
  }


  return [
    state.active,
    n => dispatch({ type: CarouselTypes.JUMP, desired: n  }),
    handlers,
    style
  ]

}