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
function model (actions, elements) {
  return xs.combine(
    actions.justA$.map(v => v.toLowerCase()),
    elements.timeContextSlider$,
    elements.ecoAreaBar$,
    elements.bioAreaBar$
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    valA,
    timeContextSlider,
    ecoAreaBar,
    bioAreaBar,
  ]) => {
    return section('.au-pg--home', [
      div('.au-pg__body', [
        timeContextSlider
      ]),
      div('.au-pg__soul', [
        ecoAreaBar,
        bioAreaBar
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
    id: 'eco',
    min: 0,
    max: 100,
    values: [50,30,70,40,90,20,100,90,30,50],
    fill: 'rgba(179,255,117, 0.2)'
  })

  const bioAreaBarProps$ = xs.of({
    id: 'bio',
    min: 0,
    max: 330,
    values: [20,300,230,170,40,50,30,50,70,90,20,100,300,90,20,100,90,30,50]
  })

  const timeContextSlider = LabeledSlider({
    DOM: sources.DOM,
    props: timeContextProps$
  })

  const ecoAreaBar = AreaBar({
    DOM: sources.DOM,
    props: ecoAreaBarProps$
  })

  const bioAreaBar = AreaBar({
    DOM: sources.DOM,
    props: bioAreaBarProps$
  })

  const elements = {
    bioAreaBar$: bioAreaBar.DOM,
    ecoAreaBar$: ecoAreaBar.DOM,
    timeContextSlider$: timeContextSlider.DOM,
  }

  return {
    DOM: view(model(intents, elements)),
    timeContext$: timeContextSlider.value,
    route$
  }
}

export default sources => isolate(HomePage)(sources)
