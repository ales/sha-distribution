import './style.css'
import { SlidingWindowCounter } from './lib/SlidingWindowCounter'
import { HalfFullSlidingCounter } from './lib/HalfFullSlidingCounter'
import { WhineException } from './lib/WhineException'

const HASH_LENGTH = 384
const MEMORY_SIZE = 32 * 16
const HASH_ALGO = `SHA-${HASH_LENGTH}`

const app = document.querySelector<HTMLDivElement>('#app')!

// `count` display
const counter = document.createElement('pre')
counter.style.position = 'absolute'
counter.style.bottom = '0'
document.body.appendChild(counter)

// `fps` display
const fps = document.createElement('pre')
fps.style.position = 'absolute'
fps.style.bottom = '0'
fps.style.right = '1rem'
fps.style.textAlign = 'right'
document.body.appendChild(fps)

// counters
const freq: SlidingWindowCounter[] = new Array(HASH_LENGTH).fill(() => new HalfFullSlidingCounter(MEMORY_SIZE / 32)).map(f => f())
let totalCount = 0

async function doIt(thicc = 8) {
  if (thicc > MEMORY_SIZE) {
    throw new WhineException(`thicc is too thicc! MEMORY_SIZE is only ${MEMORY_SIZE}`)
  }

  // calculate the hash of each input and update the frequency array for each bit for each hash
  for (const input of randomInputs(thicc)) {
    const hashArray = new Uint8Array(await digest(input))

    for (let i = 0; i < hashArray.length; i++) {
      let byte = hashArray[i]
      for (let j = 0; j < 8; j++) {
        const bit = byte & 1
        freq[i * 8 + j].write(bit)
        byte >>= 1
      }
    }
  }

  totalCount = totalCount + thicc

  app.innerHTML = freq.map(a => `<div style="height: ${(a.counter / MEMORY_SIZE * 100).toFixed(2)}vh"></div>`).join('')
  counter.innerText = `${MEMORY_SIZE} / ${totalCount}`
  fps.innerText = `${(1000 / (performance.now() - t0)).toFixed(0)} fps`

  t0 = performance.now()


  window.requestAnimationFrame(async () => {
    doIt(thicc)
  })
}

// benchmark
let t0 = performance.now()

doIt()


// utils

function randomInputs(thicc: number) {
  const inputs: Uint8Array[] = new Array(thicc)

  for (let i = 0; i < thicc; i++) {
    const length = Math.floor(Math.random() * 512)
    const array: Uint8Array = new Uint8Array(length)

    for (let j = 0; j < length; j++) {
      array[j] = Math.floor(Math.random() * 64 + 20)
    }

    inputs[i] = array
  }
  return inputs
}

function digest(data: Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.digest(HASH_ALGO, data)
}