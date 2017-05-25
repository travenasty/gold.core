import {OrbStores, OrbVersion} from 'model/base-orb'
import {log} from 'util'
import {makeDOMDriver} from '@cycle/dom'
import {makeAudioDriver} from 'driver/au/Audio'
import {makePoolDriver} from 'driver/au/Pool'
import {makeHorizonDriver} from 'driver/Horizon'
import {makeTimeContextDriver} from 'driver/au/TimeContext'
import {makeRouterDriver} from 'cyclic-router';
import createHistory from 'history/createBrowserHistory';
import Cycle from '@cycle/xstream-run'
import main from 'page/main'
import preventOverscroll from 'util/prevent-overscroll'
import switchPath from 'switch-path'

preventOverscroll(document.getElementById('au-base'))

const drivers = {
  config: () => ({
    logName: 'user_commands',
    logLimit: 12,
    userId: 1,
  }),
  DOM: makeDOMDriver('#au-base', {
    transposition: false
  }),
  hz: makeHorizonDriver({
    host: '192.168.1.78:8181',
    lazyWrites: true,
  }),
  pool: makePoolDriver({
    db: 'GOLD.pool',
    stores: OrbStores,
    version: OrbVersion,
  }),
  audio: makeAudioDriver(),
  time: makeTimeContextDriver(),
  router: makeRouterDriver(createHistory(), switchPath)
};

const rerun = Cycle.run(main, drivers)

// if (module.hot) {
//   module.hot.accept()
//   module.hot.dispose(() => {
//     rerun()
//   })
// }
