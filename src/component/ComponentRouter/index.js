import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'
import {eqProps, prop} from 'ramda'
import {log, requireSources, mergeFlatten} from 'util'

const equalPaths = eqProps('path')
const busyNode = div('.au--busy', 'Busy...')

const callComponent = sources => ({path, value}) => {
  const component = value({
    ...sources,
    router: sources.router.path(path)
  })
  return {
    ...component,
    DOM: component.DOM.startWith(busyNode)
  }
}

function ComponentRouter (sources) {
  requireSources('ComponentRouter', sources, 'routes$')

  const component$ = sources.routes$
    .map(routes => sources.router.define(routes)).flatten()
    .compose(dropRepeats(equalPaths))
    .map(callComponent(sources))
    .remember()

  const sinks = {
    pluck: key => mergeFlatten(key, [component$]),
    DOM: mergeFlatten('DOM', [component$]),
    hz: mergeFlatten('hz', [component$]),
    audio: mergeFlatten('tempo$', [component$]),
    route$: mergeFlatten('route$', [component$]),
    time: mergeFlatten('time', [component$]),
    pool: mergeFlatten('pool$', [component$]),
  }

  // log.info('sinks:', sinks)

  return sinks
}

export default sources => isolate(ComponentRouter)(sources)
