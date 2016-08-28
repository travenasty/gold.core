import {log} from 'util'
import {makeDOMDriver} from '@cycle/dom'
import {makeHorizonDriver} from 'driver'
import Cycle from '@cycle/xstream-run'

function main (sources) {
  return {};
}

const drivers = {
  DOM: makeDOMDriver('#au-base', {
    transposition: false
  }),
  HZ: makeHorizonDriver({
    host: 'localhost:8181',
    lazyWrites: true
  })
};

const dispose = Cycle.run(main, drivers)

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    dispose()
  })
}
