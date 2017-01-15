import { log } from 'util'
import isolate from '@cycle/isolate'
import {
  div, svg, h
} from '@cycle/dom'
import {
  reduce
} from 'ramda'
import xs from 'xstream'

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
  const dom = sources.DOM
  const domG = dom.select('g')
  const props$ = sources.props

  const left$ = xs.merge(
    domG.events('mousemove'),
    domG.events('touchmove'),
  ).map(ev => {
    const box = ev
    ? ev.target.getBoundingClientRect()
    : { width: 0 }
    return box.width ? ev.layerX / box.width : 0
  })
  .startWith(0)

  const state$ = xs.combine(props$, left$)
  .map(([props, left]) => ({
      id: props.id,
      values: props.values,
      points: valuesToPoints(props.values, props.min, props.max).join(' '),
      min: props.min,
      max: props.max,
      fill: props.fill || 'rgba(128,128,128, 0.5)',
      left
    })
  )

  const vdom$ = state$.map(state => {
    return svg(`#au-svg--${state.id}`, {
      attrs: {
        viewBox: '0,0 1,1',
        preserveAspectRatio: 'none'
      }
    }, [
      h('g', [
        h('polygon', {
          attrs: {
            points: state.points
          },
          style: {
            fill: state.fill,
            pointerEvents: 'none'
          }
        }),

        h('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 1,
            height: 1
          },
          style: {
            fill: 'rgba(0,0,0,0)'
          }
        }),

        h('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: state.left,
            height: 1
          },
          style: {
            fill: 'rgba(255, 255, 255, 0.25)',
            pointerEvents: 'none'
          }
        })
      ])
    ])
  })

  const sinks = {
    DOM: vdom$,
    left$
  }

  return sinks
}

export default sources => isolate(AreaBar)(sources)
