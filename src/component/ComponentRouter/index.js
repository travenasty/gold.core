import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'
import {eqProps, prop} from 'ramda'
import {requireSources} from 'util'

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

  return {
    pluck: key => component$.map(prop(key)).flatten(),
    DOM: component$.map(prop('DOM')).flatten(),
    route$: component$.map(prop('route$')).flatten()
  }
}

export default sources => isolate(ComponentRouter)(sources)
