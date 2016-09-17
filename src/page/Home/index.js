import xs from 'xstream'
import isolate from '@cycle/isolate'
import style from './home.css'
import goldStyles from 'component/au/gold.css'

import {
  log,
  randomSeries,
} from 'util'

import {
  div,
  section,
} from '@cycle/dom'

import {
  AreaBar,
  LabeledSlider,
  OrbCube,
} from 'component'

// Sources => Actions (listen to user events)
function intent (sources) {
  let actions = {
    justA$: xs.of('~'),
    time$: sources.time.context$
  }
  return actions
}

// Actions => State (process information)
function model (actions, elements) {
  return xs.combine(
    actions.justA$.map(v => v.toLowerCase()),
    actions.time$.map(v => v.frame / v.second),
    elements.orbCube$,
    elements.timeContextSlider$,
    elements.ecoAreaBar$,
    elements.bioAreaBar$,
    elements.artAreaBar$
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    valA,
    time,
    orbCube,
    timeContextSlider,
    ecoAreaBar,
    bioAreaBar,
    artAreaBar,
  ]) => {
    return section('.au-pg--home', [
      div('.au-pg__body', [
        orbCube,
      ]),
      div('.au-pg__soul', [
        ecoAreaBar,
        bioAreaBar,
        artAreaBar,
      ]),
    ])
  })
}

function HomePage (sources) {
  const route$ = xs.of('/')

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

  const orbCubeProps$ = xs.of({
    id: 'zone',
    rot$: xs.of({x: 180, y: -60, z: 30}),
    time$: sources.time.context$,
    rings: 9,
    scale: 1
  })

  const orbCube = OrbCube({
    DOM: sources.DOM,
    props: orbCubeProps$
  })

  const ecoAreaBarProps$ = xs.of({
    id: 'eco',
    min: 0,
    max: 100,
    values: randomSeries(0, 100, 20),
    fill: 'rgba(179,255,117, 0.2)'
  })

  const bioAreaBarProps$ = xs.of({
    id: 'bio',
    min: 0,
    max: 330,
    values: randomSeries(20, 300, 30)
  })

  const artAreaBarProps$ = xs.of({
    id: 'art',
    min: 100,
    max: 600,
    values: randomSeries(100, 500, 15)
  })

  const ecoAreaBar = AreaBar({
    DOM: sources.DOM,
    props: ecoAreaBarProps$
  })

  const bioAreaBar = AreaBar({
    DOM: sources.DOM,
    props: bioAreaBarProps$
  })

  const artAreaBar = AreaBar({
    DOM: sources.DOM,
    props: artAreaBarProps$
  })

  const elements = {
    orbCube$: orbCube.DOM,
    ecoAreaBar$: ecoAreaBar.DOM,
    bioAreaBar$: bioAreaBar.DOM,
    artAreaBar$: artAreaBar.DOM,
    timeContextSlider$: timeContextSlider.DOM,
  }

  return {
    DOM: view(model(intent(sources), elements)),
    time: timeContextSlider.value,
    route$
  }
}

export default sources => isolate(HomePage)(sources)
