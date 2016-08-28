import xs from 'xstream'
import {ComponentRouter} from 'component'
import {
  HomePage,
  OtherPage
} from 'page'

const routes = {
  '/': HomePage,
  '/other': OtherPage
}

export default function main (sources) {
  return ComponentRouter({
    ...sources,
    routes$: xs.of(routes)
  })
}
