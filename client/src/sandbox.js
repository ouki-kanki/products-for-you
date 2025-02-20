const a = {
  a: 'foo',
  b: 'bar'
}

const b = {
  a: 'foo',
  b: 'bar'
}

const c = {
  a: 'foort',
  b: 'bar'
}

const isObjValuesSame = (a, b) => {
  let flag = true
  Object.keys(a).forEach((key) => {
    if (a[key] !== b[key]) {
      flag = false
    }
  })

  return flag
}

// console.log(isObjValuesSame(a, c))

const arr = []

console.log(Boolean(arr))

if (arr) {
  console.log("this is a")
}

const items = [
  {
    position: 2
  },
  {
    position: 3
  },
  {
    position: 1
  }
]


items.sort((a, b) => a.position - b.position)

console.log(items)
