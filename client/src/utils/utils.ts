export function assertCannotReach(x: never) {
  throw new Error(`some case is missing, value ${x} has type of never`)
}