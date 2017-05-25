import {OrbModel} from 'model/base-orb'
import {ComponentRouter} from 'component'
import {
  DynamicPage,
  HomePage,
  OtherPage
} from 'page'
import {log} from 'util'
import xs from 'xstream'

export default function main (sources) {
  // const state$ = sources.onion.state$

  const routes = {
    '/': HomePage,
    '/other': OtherPage,
    '/z': DynamicPage,
  }

  const db = sources.pool.db
  // console.log('pool-db', db, OrbModel)

  //db.zone.toCollection().delete()
  //db.zone.get({name: 'trave'}).then(log.warn)

  // RESET STORES BACK TO INITIAL FRESH STATE
  /*
  Object.keys(OrbModel).forEach(storeName => {
    console.log('storeName:', storeName)
    db[storeName].toCollection().delete()

    OrbModel[storeName].forEach(record => {
      db[storeName].put(record).then(log.warn)
    })
  })
  */

  // db.page.delete("9e00fd2f-85df-4f01-dd7f-4cbc9793e211");

  // extend routes with data-driven Page controller
  db.zone.get({name: 'sand'})
  .then(registerDynamicRoute)
  // .then(makeComponentRouter)

  const pg = makeComponentRouter()

  // log.fail ('pg:', pg);

  function makeComponentRouter () {
    log.info ('makeComponentRouter...');
    return ComponentRouter({
      ...sources,
      routes$: xs.of(routes)
    })
  }

  // const initReducer$ = xs.of(function initReducer () {
  //   return 0
  // })
  //
  // const addOneReducer$ = xs.periodic(1000)
  // .mapTo(function addOneReducer (prev) {
  //   return prev + 1
  // })

  // const reducer$ = xs.merge(initReducer$, addOneReducer$)

  // Sinks back into drivers...
  return {
    DOM: pg.DOM,
    // onion: reducer$,
    audio: pg.audio,
    hz: pg.hz,
    // pool: pg.pool$,
    router: pg.route$,
    time: pg.time,
  }

  function registerDynamicRoute (page) {
    log.info ('register dynamic page:', page);
    routes[`/${page.name}`] = DynamicPage;
    return this;
  }
}
