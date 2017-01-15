import xs from 'xstream'
import tween from 'xstream/extra/tween'
import isolate from '@cycle/isolate'
import style from './home.css'
import goldStyles from 'component/au/gold.css'

import {
  log, randomSeries,
} from 'util'

import {
  div, form, input, ol, li, section, span
} from '@cycle/dom'

import {
  AreaBar, LabeledSlider, OrbCube,
} from 'component'

// Sources => Actions (listen to user events)
function intent (sources) {
  // const hzLog = sources.hz(sources.config.logName)
  // log.warn ('hzLog:', hzLog)

  // setTimeout(sources.pool.stuff, 250)

  const msgTap$ = sources.DOM
  .select('.au-msg')
  .events('click')
  .debug(log.fail)
  .map(ev => ev.target.id.replace(/^msg\-/, ''))

  const sendCommand$ = sources.DOM
  .select('.au-input--command')
  .events('keydown')
  .filter(ev => ev.keyCode === 13)
  .map(ev => ev.target.value || null)
  .debug(log.pass)

  const commandChange$ = sources.DOM
  .select('.au-input--command')
  .events('input')
  .map(ev => ev.target.value)

  const commands$ = sources.hz
  // const commands$ = xs.of([1,2,3,4,5])

  // const commands$ = convert.rx.to.xstream(sources.hz)
  //   hzLog.order('datetime', 'descending')
  //   .limit(sources.config.logLimit)
  //   .watch()
  // )

  const writeOps$$ = sendCommand$.map(text => {
    const write$ = xs.of(text)
    // const write$ = hzLog.store({
    //   userId: sources.config.userId,
    //   datetime: new Date(),
    //   text,
    // })
    // log.info('write$:', write$)
    return write$
  })

  const commandValue$ = xs.merge(
    sendCommand$.mapTo(null),
    commandChange$
  )

  const actions = {
    commandValue$,
    writeOps$$,
    commands$,
    time$: sources.time.context$
  }
  return actions
}

// Actions => State (process information)
function model (actions, elements, values) {
  return xs.combine(
    actions.commandValue$.startWith(null),
    actions.commands$.map(CommandLog),
    actions.time$.map(v => v.frame / v.second),
    elements.orbCube$,
    elements.timeContextSlider$,
    elements.ecoAreaBar$,
    elements.bioAreaBar$,
    elements.artAreaBar$,
    values.rings$,
    values.tempo$
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    commandValue,
    commandLog,
    time,
    orbCube,
    timeContextSlider,
    ecoAreaBar,
    bioAreaBar,
    artAreaBar,
    numRows,
    tempo
  ]) => {
    return section('.au-pg--home', [
      div('.au-pg__body', [
        orbCube,
      ]),
      div('.au-pg__soul', [
        ecoAreaBar,
        bioAreaBar,
        artAreaBar,

        form('.au-soul__form', {}, [
          input('.au-input--command', {
            props: {
              value: commandValue,
            },
            autoFocus: true,
          }),
        ]),

        span('.au-val--left', {}, `${numRows} : ${tempo}`),

        commandLog
      ]),
    ])
  })
}

function CommandLog (commands) {
  // log.fail(commands)
  return ol('.au-list--commands', {}, commands.map(cmd =>
    li('#msg--' + cmd.id + '.au-msg', cmd.msg)
  ))
}

function HomePage (sources) {
  const route$ = xs.of('/')
  const actions = intent(sources)

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
    values: randomSeries(20, 300, 30),
    left: 0.5
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

  const values = {
    rings$: bioAreaBar.left$.map(v => Math.round(v * 12)),
    scale$: artAreaBar.left$.map(v => (v <= 0) ? 1 : v * 3),
    tempo$: ecoAreaBar.left$.map(v => Math.ceil(v * 300))
  }

  const orbCubeProps$ = xs.of({
    id: 'zone',
    rot$: xs.of({x: 180, y: -60, z: 30}),
    time$: sources.time.context$,
    ring$: values.rings$,
    scale$: values.scale$,
    tempo$: values.tempo$
  })

  const orbCube = OrbCube({
    DOM: sources.DOM,
    props: orbCubeProps$
  })

  const elements = {
    orbCube$: orbCube.DOM,
    ecoAreaBar$: ecoAreaBar.DOM,
    bioAreaBar$: bioAreaBar.DOM,
    artAreaBar$: artAreaBar.DOM,
    timeContextSlider$: timeContextSlider.DOM,
  }

  return {
    DOM: view(model(actions, elements, values)),
    time: timeContextSlider.value,
    tempo$: values.tempo$,
    hz: actions.writeOps$$,
    route$
  }
}

export default sources => isolate(HomePage)(sources)
