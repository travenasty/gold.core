import xs from 'xstream'
import isolate from '@cycle/isolate'
import {
  section, p
} from '@cycle/dom'

// Sources => Actions (listen to user events)
function intent (sources) {
  return {
    justB$: xs.of('B')
  }
}

// Actions => State (process information)
function model (actions) {
  return xs.combine(
    actions.justB$.map(v => v.toLowerCase())
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    valB
  ]) => {
    return section('.au-pg--other', [
      p('.au-pg__body', 'OTHER ' + valB)
    ])
  })
}

function OtherPage (sources) {
  const route$ = xs.of('/other')
  const intents = intent(sources)

  return {
    DOM: view(model(intent(sources))),
    route$
  }
}

export default sources => isolate(OtherPage)(sources)
