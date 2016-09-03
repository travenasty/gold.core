import {log} from 'util';
import xs from 'xstream'

function setScale (scale) {
  log.info ('set scale:', scale);
}

export function makeTimeContextDriver (conf) {
  return function timeContextDriver (timeContext$) {
    const context$ = xs.of({
      century: 21,
      decade: 2,
      year: 2016,
      quarter: 4,
      month: 11,
      week: 55,
      day: 360,
      hour: 10,
      minute: 5,
      second: 55,
      frame: 59
    })

    return {
      setScale,
      context$
    }
  }
}
