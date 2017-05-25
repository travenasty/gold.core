import {log, U} from 'util'
import xs from 'xstream'
import isolate from '@cycle/isolate'
import {window} from 'global-object'
import {
  b, button, input, label, li, ol, p, pre, section, span
} from '@cycle/dom'
import style from './dynamic.css'

const nowDate = new Date()
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const localDateTime = nowDate.toLocaleDateString('en-US', dateOptions)

function PageList (pages) {
  return ol('.au-list--pages', {},
    pages.map(page => li('.au-link--page', {
      attrs: {
        'data-uuid': page.uuid,
      }
    }, [
      b('.page-name', {}, page.name),
      span('.page-info', {}, page.info),
      button('.btn--delete', U.times)
    ]))
  )
}

function clickToPageUuid (click) {
  return click.currentTarget.parentNode.dataset.uuid;
}

// Sources => Actions (listen to user events)
function intent (sources, page) {
  // log.info ('intent args:', sources, page)
  const pool = sources.pool
  // Add user-intent streams from DOM events

  const btnDelete = sources.DOM.select('.btn--delete')
  const delPage$ = btnDelete.events('click')
  .map(clickToPageUuid)
  .debug(pgId => {
    log.info('delete pgId:', pgId);
    pool.del('page', pgId)
  })

  const btnTime = sources.DOM.select('.au-btn--time')
  const push$ = btnTime.events('click').map(clickToBlob)
  .debug(data => {
    // Side effect...
    // log.warn ('SAVE:', data)
    pool.save('page', page, data)
  })

  const editInfo$ = sources.DOM.select('.au-input--info')
  .events('blur')
  .map(ev => ev.target.value)
  .debug(log.warn)

  // log.warn('pool.delete$:', pool.delete$)

  return {
    push$,
    delPage$,
    delete$: pool.delete$,
    editInfo$,
  }
}

function clickToBlob (click) {
  // log.info ('CLICK:', click)
  const blob = [1,3,4,1];
  blob.push(Math.floor(log.now()))
  return {blob}
}

// Actions => State (process information)
function model (actions, pool) {
  return xs.combine(
    // blob
    actions.push$.map(o => o.blob).startWith(['NONE']),
    // foo
    actions.delPage$.startWith(['foo']),
    // page
    pool.data$.filter(rec => rec.type === 'page')
    .map(rec => rec.data).fold(Object.assign, {}),
    // pages
    pool.data$.filter(rec => rec.type === 'pages')
    .map(rec => rec.data),
    // delete
    actions.delete$.startWith('...').debug(delRec => {
      log.info('delRec:', delRec)
      reloadPages(pool)
    }),
    // editInfo
    actions.editInfo$.startWith('')
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  // console.log('view:', pages);
  return state$.map(([
    blob,
    foo,
    page,
    pages,
    deleted,
    editInfo,
  ]) => {
    return section('.au-pg--dynamic', [
      pre('.au-foo--deleted', 'DELETED: ' + JSON.stringify(deleted, null, 2)),
      p('.au-pg__body', 'SAND ' + blob.join(':')),
      pre('.au-pg__pool', 'PAGE\n\n' + JSON.stringify(page, null, 2)),
      span('.au-btn--time.material-icons', 'alarm'),
      PageList(pages),
      p('.foo', JSON.stringify(foo, null, 2)),
      label('', 'INFO: ' + editInfo),
      input('.au-input--info', {attrs:{placeholder:'INFO'}}),
    ])
  })
}

function toPageLite (page) {
  return {
    uuid: page.uuid,
    name: page.name,
    info: page.info
  }
}

function reloadPages (pool) {
  log.info ('reloadPages...');
  pool.db.page.orderBy('name').toArray().then(sortedPages => {
    pool.load ('pages', null, sortedPages.map(toPageLite))
  })
}

function DynamicPage (sources) {
  const pool = sources.pool
  const path = window.location.pathname.split('/')
  const page = path[2]

  const freshInfo = `New page created on ${localDateTime}`

  pool.load('page', page, {info: freshInfo})

  // log.info ('pool:', sources.pool)
  reloadPages(pool)

  // TODO : Inspect from current route.
  const route$ = xs.of(location.pathname)
  const intents = intent(sources, page)

  return {
    DOM: view(model(intents, pool)),
    route$
  }
}

export default sources => isolate(DynamicPage)(sources)
