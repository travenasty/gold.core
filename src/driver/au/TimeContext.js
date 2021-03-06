import {log} from 'util';
import xs from 'xstream'

function setScale (scale) {
  log.info ('set scale:', scale)
}

function setTempo (tempo) {
  log.error ('set tempo:', tempo)
}

export function makeTimeContextDriver (conf) {
  return function timeContextDriver (timeContext$) {
    const frameRate = 1000/60

    const context$ = xs.periodic(frameRate)
    .fold((acc, tick) => {
      acc.frame = tick % 60
      acc.second = (((tick * frameRate) / 1000) % 60).toFixed(2)
      return acc;
    }, {
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
      setTempo,
      context$
    }
  }
}
