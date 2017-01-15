import {log} from 'util'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'
import dropRepeats from 'xstream/extra/dropRepeats'

window.AudioContext = window.AudioContext || window.webkitAudioContext

const baseElem = document.getElementById('au-base')
const context = new AudioContext()

let oscillator = null
let envelope = null

function play (id) {
  console.log (p)
}

export function makeAudioDriver (conf) {
  return function audioDriver (audio$) {
    let freq = 20
    let fps = 60
    let pace = 1000 / fps // 16.666...
    let gain = 0.0

    oscillator = context.createOscillator()
    oscillator.frequency.setValueAtTime(freq, 0)
    envelope = context.createGain()
    oscillator.connect(envelope)
    envelope.connect(context.destination)
    envelope.gain.value = 0.0


    // Chirp per whole note.


    xs.combine(
      xs.periodic(pace), // Roughly 60 "frames" per second
      audio$.compose(dropRepeats()).startWith(0)
    )
    // .filter()
    .addListener({
      next: ([i, tempo]) => {
        // sample 60 frames per second
        // 60 beats per minute

        // gain += i * 0.06
        // freq += tempo * 2
        // freq = freq > 9205 ? 1 : freq
        // gain = gain > 10 ? 0 : gain

        // freq = i % Math.ceil(tempo/60) === 0 ? tempo : 0

        let bps = tempo / fps
        let drip = Math.ceil(fps / bps)
        freq = i % drip === 0 ? 80 : 0

        oscillator.frequency.setValueAtTime(freq, 0)
        envelope.gain.value = 0.5
      },
      error: log.fail,
      complete: log.pass
    })

    //baseElem.addEventListener('click', () => {
      oscillator.start(0)
    //})

    return {
      play
    }
  }
}
