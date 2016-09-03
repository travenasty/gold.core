import isolate from '@cycle/isolate'
import {
  svg, h
} from '@cycle/dom'
import {
  reduce
} from 'ramda'

function valuesToPoints (values, min, max) {
  const stepDist = 1 / values.length
  let stepAt = 0

  return reduce((poly, val) => {
    let valAt = (val > max) ? max : (val < min) ? min : (val/max);
    let point = `${stepAt},${valAt}`
    stepAt += stepDist
    poly.push(point);
    return poly;
  }, ['1,0', '0,0'], values);
}

function AreaBar (sources) {
  const domSource = sources.DOM
  const props$ = sources.props

  const state$ = props$
  .map(props => ({
      id: props.id,
      values: props.values,
      points: valuesToPoints(props.values, props.min, props.max).join(' '),
      min: props.min,
      max: props.max,
      fill: props.fill || 'rgba(128,128,128, 0.5)'
    })
  )
  .remember()

  const vdom$ = state$
  .map(state => {
    return svg(`#au-svg--${state.id}`, {
      attrs: {
        viewBox: '0,0 1,1',
        preserveAspectRatio: 'none'
      }
    }, [
      h('polygon', {
        attrs: {
          points: state.points
        },
        style: {
          fill: state.fill
        }
      })
    ])
  })

  const sinks = {
    DOM: vdom$
  }

  return sinks
}

export default sources => isolate(AreaBar)(sources)
