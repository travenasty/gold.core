import isolate from '@cycle/isolate'
import {
  svg, h
} from '@cycle/dom'

function AreaBar (sources) {
  const domSource = sources.DOM
  const props$ = sources.props

  const state$ = props$
    .map(props => ({
        label: props.label,
        values: props.values,
        min: props.min,
        max: props.max
      })
    )
    .remember()

  const vdom$ = state$
    .map(state =>
      svg('#au-svg--soul', {
        attrs: {
          viewBox: '0,0 100,100',
          preserveAspectRatio: 'none'
        }
      }, [
        h('polygon', {
          attrs: {
            points: '0,50 10,30 20,10, 30,0, 40,10 50,30 60,70 70,90, 80,80 90,55 100,50 100,100 0,100'
          },
          style: {
            fill: 'rgba(117, 255,79, 0.5)'
          }
        })
      ])
    )

  const sinks = {
    DOM: vdom$
  }

  return sinks
}

export default sources => isolate(AreaBar)(sources)
