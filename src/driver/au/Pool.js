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

  const change$ = xs.create()

  const create$ = change$.filter(change => change.type === 1)
  const update$ = change$.filter(change => change.type === 2)
  const delete$ = change$.filter(change => change.type === 3)

  const pool$ = xs.create()

  pool$.addListener({
    next: log.pass,
    error: log.fail,
    complete: log.info
  })

  db.version(conf.version).stores(conf.stores)

  db.on('changes', function (changes) {
    log.warn ('changes:', changes);
    changes.map(change => change$.shamefullySendNext(change))
  });

  function load (store, name, fresh) {
    db[store].get({name}).then(rec => {
      // log.info('store rec name:', store, name, rec, fresh);

      if (rec) {
        pool$.shamefullySendNext({type: store, data: rec})
      } else {
        // TODO : Load from REMOTE, before creating fresh.
        db[store].put(Object.assign(fresh, {name})).then(newrec => {
          pool$.shamefullySendNext({type: store, data: newrec})
        })
      }
    })
  }

  function save (store, name, props) {
    // log.fail ('POOL SAVE not yet implemented', store, name, value)
    db[store].where('name').equals(name).modify(rec => {
      // log.warn ('save… find record by name:', store, name, rec)
      pool$.shamefullySendNext({type: store, data: Object.assign(rec, props)})
    })
  }

  return function poolDriver (input$) {
    // TODO : Handle input$ stream

    return {
      db,
      load,
      save,

      create$,
      update$,
      delete$,

      pool$,
    }
  }
}
