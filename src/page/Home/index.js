import xs from 'xstream'
import isolate from '@cycle/isolate'
import {
  section, div
} from '@cycle/dom'
import {
  LabeledSlider
} from 'component'
import style from './home.css'

// Sources => Actions (listen to user events)
function intent (sources) {
  return {
    justA$: xs.of('~')
  }
}

// Actions => State (process information)
function model (actions, timeContextSliderNode$) {
  return xs.combine(
    actions.justA$.map(v => v.toLowerCase()),
    timeContextSliderNode$
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    valA,
    timeContextSlider
  ]) => {
    return section('.au-pg--home', [
      div('.au-pg__body', [
        timeContextSlider
      ]),
    ])
  })
}

function HomePage (sources) {
  const route$ = xs.of('/')
  const intents = intent(sources)

  const timeContextProps$ = xs.of({
    label: 'day #',
    unit: ' of 2016 ',
    min: 1,
    max: 365,
    value: 200
  })

  const timeContextSlider = LabeledSlider({
    DOM: sources.DOM,
    props: timeContextProps$
  })

  return {
    DOM: view(model(intents, timeContextSlider.DOM)),
    timeContext$: timeContextSlider.value,
    route$
  }
}

export default sources => isolate(HomePage)(sources)
