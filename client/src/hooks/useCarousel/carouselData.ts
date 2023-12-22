import type { ICarouselOptions } from "./carouselTypes"


export const DEFAULT_LENGTH = 5
export const DEFAULT_INTERVAL = 500
export const DEFAULT_TRANSITION_TIME = 400
export const DEFAULT_OPTIONS: ICarouselOptions = {
  slidesPresented: 5
}

export const THRESHOLD = 0.3
export const LIMIT = 1.2
export const ELASTIC = `transform ${DEFAULT_TRANSITION_TIME}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
export const SMOOTH = `transform ${DEFAULT_TRANSITION_TIME}ms ease`;