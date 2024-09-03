const testParams = (path, params) => {
  // console.log(params)
  console.log('yoyoyo', params)

  let params_str = ''
  for (const [key, value] of Object.entries(params)) {
    if (!params_str) {
      params_str += `?${key}=${value}`
    } else {
      params_str += `&${key}=${value}`
    }
  }

  console.log(params_str)


  const finalPath = `path`

}


testParams('test', {
  name: 'max',
  age: 23
})




const arr = Array.from(Array(10))

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

// console.log(prev)
// console.log(post)
