import {log} from 'util'
import {makeDOMDriver} from '@cycle/dom'
import {makeHorizonDriver} from 'driver'
import {makeTimeContextDriver} from 'driver'
import {makeRouterDriver} from 'cyclic-router';
import {createHistory} from 'history';
import Cycle from '@cycle/xstream-run'
import main from 'page/main'

const drivers = {
  DOM: makeDOMDriver('#au-base', {
    transposition: false
  }),
  hz: makeHorizonDriver({
    host: 'localhost:8181',
    lazyWrites: true
  }),
  time: makeTimeContextDriver(),
  router: makeRouterDriver(createHistory())
};

const rerun = Cycle.run(main, drivers)

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    rerun()
  })
}
