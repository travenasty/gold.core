
import {log} from 'util'
import xs from 'xstream'
import convert from 'stream-conversions'
import Horizon from '@horizon/client'

export function makeHorizonDriver (conf) {
  return function() { return xs.of([]); }
  /*
  let hz = Horizon(conf);
  let hzLog = hz('log')

  // log.info('conf, hz:', conf, hz, hzLog)

  function horizonDriver(write$$) {
    write$$.flatten().addListener({
      next: outgoing => {
        // log.info('hzLog:', hzLog)
        let res = hzLog.store({
          date: new Date(),
          msg: outgoing,
          user: 1
        })
        // log.warn('store res:', res)
        res.subscribe()
      },
      error: err => {
        log.fail('hz err:', err)
      },
      complete: () => {},
    });

    return convert.rx.to.xstream(
      hzLog.order('date', 'descending')
      .limit(10)
      .watch()
    ) // .debug(log.info)
  }

  return horizonDriver;
  */
}
