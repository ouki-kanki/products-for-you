
const items = ['item1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9', 'item-10']
const num = 4
const active = 2
const length = items.length


const prevInd = (length, num, activeIndex) => {
  return [ ...Array(num)]
    .map(_ => {
      const temp = num
      num -= 1 // is copied by value, so no prob

      return (activeIndex - temp + length) % length
  })
}

const postInd = (length, num, activeIndex) => {
  return [...Array(num)]
    .map(_ => {
      const temp = num
      num -= 1
    
      return (activeIndex + temp) % length
    }).reverse()
}


const prev = prevInd(length, num, active)
const post = postInd(length, num, active)

console.log(prev)
console.log(post)