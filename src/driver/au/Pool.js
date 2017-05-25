/*
  IDEA : Persistent pool of . ALL app data changes are dripped into
  these stores and lazily negotiated with backend resolution services.

  Entire model can be imported from and exported to a local file archive.
*/

import {log} from 'util'
import xs from 'xstream'
import Dexie from 'dexie'
import 'dexie-observable'

export function makePoolDriver (conf) {
  const db = new Dexie(conf.db)

  const debugListener = {
    next: log.fail,
    error: log.fail,
    complete: log.info
  }

  const onDeleteListener = {
    next: value => log.info('DELETED', value),
    error: value => log.fail('(error) DELETED', value),
    complete: value => log.pass('(complete) DELETED', value),
  }

  const change$ = xs.create()

  const create$ = change$.filter(change => change.type === 1)
  const update$ = change$.filter(change => change.type === 2)
  const delete$ = change$.filter(change => change.type === 3)

  const data$ = xs.create()

  data$.addListener(debugListener)
  delete$.addListener(onDeleteListener)

  db.version(conf.version).stores(conf.stores)

  db.on('changes', function (changes) {
    // log.warn ('changes:', changes);
    changes.map(change => change$.shamefullySendNext(change))
  });

  function load (type, name, fresh) {
    if (db[type]) {
      db[type].get(name).then(rec => {
        // log.info('store rec name:', store, name, rec, fresh);

        if (rec) {
          data$.shamefullySendNext({type, data: rec})
        } else {
          let data = Object.assign(fresh, {name})
          // TODO : Load from REMOTE, before creating fresh.
          db[type].put(data).then(recId => {
            data$.shamefullySendNext({type, data})
          })
        }
      })
    } else {
      data$.shamefullySendNext({type, data: fresh})
    }
  }

  function save (type, name, props) {
    // log.fail ('POOL SAVE not yet implemented', store, name, value)
    db[type].where('name').equals(name).modify(rec => {
      // log.warn ('save… find record by name:', store, name, rec)
      data$.shamefullySendNext({type, data: Object.assign(rec, props)})
    })
  }

  function del (type, uuid) {
    db[type].delete(uuid)
    // log.fail ('deleted:', uuid)
  }

  return function poolDriver (input$) {
    // TODO : Handle input$ stream

    return {
      db,
      load,
      save,
      del,

      create$,
      update$,
      delete$,

      data$,
    }
  }
}
