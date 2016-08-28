import {log} from 'util';
import xstream from 'xstream'
import Horizon from '@horizon/client'

export function makeHorizonDriver (conf) {
  return function horizonDriver(writeOps$$) {
      // TODO: Send outgoing messages
      // log.info ("writeOps$$:", writeOps$$)

      const horizon = Horizon(conf)

      horizon.onReady(function () {
        log.info('HORIZON CONNECTED')
      })
      horizon.connect()

      return horizon
  }
}
