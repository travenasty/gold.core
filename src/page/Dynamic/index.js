import {log} from 'util'
import xs from 'xstream'
import isolate from '@cycle/isolate'
import {window} from 'global-object'
import {
  p, pre, section, span
} from '@cycle/dom'

// Sources => Actions (listen to user events)
function intent (sources, page) {
  log.info ('intent sources:', sources, page)
  const save = sources.pool.save
  // Add user-intent streams from DOM events

  const btnTime = sources.DOM.select('.au-btn--time')
  const push$ = btnTime.events('click').map(clickToBlob)
  .debug(data => {
    // Side effect...
    // log.warn ('SAVE:', data)
    save('page', page, data)
  })

  return {
    push$
  }
}

function clickToBlob (click) {
  // log.info ('CLICK:', click)
  const blob = [1,3,4,1];
  blob.push(Math.floor(log.now()))
  return {blob}
}

// Actions => State (process information)
function model (actions, pool$) {
  const page$ = pool$.filter(rec => rec.type === 'page')
  .map(rec => rec.data)

  return xs.combine(
    actions.push$.map(o => {
      return o.blob
    }).startWith(['NONE']),
    page$.fold(Object.assign, {})
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    blob,
    page
  ]) => {
    return section('.au-pg--dynamic', [
      p('.au-pg__body', 'SAND ' + blob.join(':')),
      pre('.au-pg__pool', 'PAGE\n\n' + JSON.stringify(page, null, 2)),
      span('.au-btn--time.material-icons', 'alarm')
    ])
  })
}

function DynamicPage (sources) {
  const db = sources.pool.db
  const load = sources.pool.load
  const pool$ = sources.pool.pool$

  const path = window.location.pathname.split('/')
  const page = path[2]

  load('page', page, {info: 'NEWER PAGE'})

  // log.info ('pool:', sources.pool)

  // TODO : Inspect from current route.
  const route$ = xs.of(location.pathname)
  const intents = intent(sources, page)

  return {
    DOM: view(model(intents, pool$)),
    route$
  }
}

export default sources => isolate(DynamicPage)(sources)
