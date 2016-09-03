import xs from 'xstream'
import isolate from '@cycle/isolate'
import {
  section, div
} from '@cycle/dom'
import {
  AreaBar,
  LabeledSlider,
} from 'component'
import style from './home.css'

// Sources => Actions (listen to user events)
function intent (sources) {
  return {
    justA$: xs.of('~')
  }
}

// Actions => State (process information)
function model (actions, timeContextSliderNode$, ecoAreaBarNode$) {
  return xs.combine(
    actions.justA$.map(v => v.toLowerCase()),
    timeContextSliderNode$,
    ecoAreaBarNode$
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    valA,
    timeContextSlider,
    ecoAreaBar,
  ]) => {
    return section('.au-pg--home', [
      div('.au-pg__body', [
        timeContextSlider
      ]),
      div('.au-pg__soul', [
        ecoAreaBar
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

  const ecoAreaBarProps$ = xs.of({
    label: 'eco',
    min: 0,
    max: 100,
    values: [50,30,70,40,90,20,100,90,30,50]
  })

  const timeContextSlider = LabeledSlider({
    DOM: sources.DOM,
    props: timeContextProps$
  })

  const ecoAreaBar = AreaBar({
    DOM: sources.DOM,
    props: ecoAreaBarProps$
  })

  return {
    DOM: view(model(intents, timeContextSlider.DOM, ecoAreaBar.DOM)),
    timeContext$: timeContextSlider.value,
    route$
  }
}

export default sources => isolate(HomePage)(sources)
