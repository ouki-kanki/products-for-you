export const enum CarouselTypes {
  JUMP,
  NEXT,
  PREV,
  DONE,
  DRAG
}

export type ICarouselState = {
  offset: number,
  desired: number,
  active: number
}

export interface ICarouselOptions {
  slidesPresented?: number;
}

export type IConfig = {
  length?: number,
  interval?: number,
  transitionTime?: number,
  options?: ICarouselOptions 
}

export type ICarouselAction = 
  | { type: CarouselTypes.JUMP,  desired: number }
  | { type: CarouselTypes.NEXT,  length: number }
  | { type: CarouselTypes.PREV,  length: number }
  | { type: CarouselTypes.DRAG,  offset: number }
  | { type: CarouselTypes.DONE }
