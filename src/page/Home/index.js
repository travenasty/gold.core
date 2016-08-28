import xs from 'xstream'
import isolate from '@cycle/isolate'
import {
  section, p
} from '@cycle/dom'

// Sources => Actions (listen to user events)
function intent (sources) {
  return {
    justA$: xs.of('A')
  }
}

// Actions => State (process information)
function model (actions) {
  return xs.combine(
    actions.justA$.map(v => v.toLowerCase())
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    valA
  ]) => {
    return section('.au-pg--home', [
      p('.au-pg__body', 'HOME ' + valA)
    ])
  })
}

function HomePage (sources) {
  const route$ = xs.of('/')
  const intents = intent(sources)

  return {
    DOM: view(model(intent(sources))),
    route$
  }
}

export default sources => isolate(HomePage)(sources)
