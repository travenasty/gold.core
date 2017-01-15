import { log, climbToMatch } from 'util'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import tween from 'xstream/extra/tween'

import {
  figure, figcaption, li, ol, pre
} from '@cycle/dom'

import {
  concat, reduce, times
} from 'ramda'

function toCoord (ev) {
  ev.preventDefault();
  let boxSize = ev.target ? climbToMatch(ev.target, '.au-cube').clientWidth : 1
  let evX = ev.layerX || ev.x;
  let evY = ev.layerY || ev.y;
  return {
    x: ((evX / boxSize) - 0.5) * 2,
    y: ((evY / boxSize) - 0.5) * 2,
    at: log.now(),
  }
}

// Sources => Actions (capture useful user events)
function intent (sources) {
  const domCube = sources.DOM.select('.au-cube');

  const point$ = xs.merge(
    domCube.events('mousemove'),
    domCube.events("touchmove")
  ) // .compose(debounce(32))
  .map(toCoord).startWith({x: 0, y: 0})

  const dotTap$ = xs.merge(
    domCube.events('mousedown'),
    domCube.events('touchstart'),
  ).filter(
    ev => ev // .target.classList.contains('au-orb__dot')
  ).map(toCoord)

  const spin$ = dotTap$.map(tap =>
    point$.endWhen(xs.merge(
      domCube.events('mouseup'),
      domCube.events('mouseleave'),
      domCube.events('touchend')
    ))
  ).flatten()
  .fold((acc, ps) => {
    const pos = (acc.fresh) ? ps : acc
    const dur = ps.at - pos.at
    const xd = (pos.x - ps.x)
    const yd = (pos.y - ps.y)
    const xv = dur ? xd / dur : 0
    const yv = dur ? yd / dur : 0

    // TODO: Leverage distance & velocity to determine multiplied difference.
    // log.info ('dur,xd,yd,xv,yv:', dur,xd,yd,xv,yv)
    // log.fail (JSON.stringify(acc))
    // log.pass(acc.x, acc.xv)

    return {
      at: ps.at,
      x: ps.x,
      y: ps.y,
      z: 0, // ps.z // TODO: Two touch rotate.
      xv: xv + (acc.xv ? acc.xv : 0),
      yv: yv + (acc.yv ? acc.yv : 0),
    }
  }, {x: 0, y: 0, z: 0, xv: 0, yv: 0, fresh: true})
  .startWith({x: 0, y: 0, z: 0})

  const flick$ = xs.merge(
    domCube.events('mouseup'),
    domCube.events('touchend'),
  ).mapTo(spin$.take(1)).flatten()
  .map(spin => {
    // TODO : Calculate destination from spin velocity, etc.
    // const xdur = Math.abs(spin.xv) * 1000

    return tween({
      from: 0,
      to: 1,
      ease: tween.exponential.easeOut,
      duration: 2000,
      interval: 32,
    }).map(d => ({
      x: spin.x * d,
      y: spin.y * d,
      z: 0,
    })).endWhen(xs.merge(
      domCube.events('mousedown'),
      domCube.events('touchstart')
    ))
  }).flatten()

  let actions = {
    dotTap$,
    point$,
    spin$: xs.merge(spin$, flick$),
  }
  return actions
}

// Actions+Props => State (transform into values)
function model (actions, props$) {
  return xs.combine(
    props$,
    props$.map(props => props.time$).flatten(), // .time
    props$.map(props => props.ring$).flatten(), // .ring
    props$.map(props => props.scale$).flatten(), // .scale
    actions.spin$.map(spin => ({
      x: spin.y * -1,
      y: spin.x * 1,
      z: spin.z * -1
    })),
    actions.point$,
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    props,
    time,
    rings,
    scale,
    rot,
    point,
  ]) => {
    const orbStyle = {
      transform: `
        rotateX(${rot.x * 180}deg)
        rotateY(${rot.y * 180}deg)
        rotateZ(${rot.z * 180}deg)
      `
    }

    const northPoleStyle = {
      transform: `
        translateX(-0.5em)
        translateY(-0.5em)
        translateZ(${ (rings) * scale }em)
      `
    }

    const southPoleStyle = {
      transform: `
        rotateX(180deg)
        translateY(0.5em)
        translateX(-0.5em)
        translateZ(${ (rings) * scale }em)
      `
    }

    return figure(`.au-cube.au-cube--${props.id}`, {
      attrs: {
        tabindex: 0
      },
    }, [
      ol(`.au-orb.au-cube__orb`, {
        attrs: {
          tabindex: 0
        },
        style: orbStyle,
      }, [
        li('.au-orb__hemi.au-hemi--north',
          ["#FFF", "#AAA", "#FFF", "#AAA", "#FFF", '#999']
          .map(color => OrbFace(rings, scale, color))
        ),
        li('.au-orb__hemi.au-hemi--south',
          ["#F00", "#F0F", "#FF0", "#0FF", "#0F0", "#00F"]
          .map(color => OrbFace(rings, scale, color))
        ),
        li('.au-orb__dot.au-pole--north', {
          style: northPoleStyle
        }),
        li('.au-orb__dot.au-pole--south', {
          style: southPoleStyle
        }),
      ]),
      figcaption('.au-cube__info', [
        pre('.au-note', `PX ${ point.x.toFixed(2) } PY ${ point.y.toFixed(2) }`),
        // pre('', `X ${ rot.x.toFixed(2) }\nY ${ rot.y.toFixed(2) }\nZ ${rot.z}`),
        // pre('', `F ${time.frame}\nS ${time.second}`),
      ])
    ])
  })
}

// Generate the markup and plot sphere-face positions.
function OrbFace (rows = 22, scale = 2, color = '#F22') {
  const RAD = rows * scale

  let angX = (90 / rows) - 0.25
  let rotX = -angX + (angX / 2.5)
  let rotY = 0
  let rotZ = 0
  let step = 1
  let dots = []

  // console.log('rows:', rows)

  times(row => {
    row += 1;
    let angZ = 60 / row

    if (row > 1) {
      rotX -= angX
    }
    rotY = 60 / row
    rotZ = 0

    dots = concat(dots, times(col => {
      let transform = `
        translateY(-0.5em)
        rotateZ(${rotZ}deg)
        rotateX(${rotX}deg)
        translateZ(${RAD}em)
      `

      let dot = li('.au-orb__dot', {
        attrs: {
          tabindex: 0,
        },
        style: {
          backgroundColor: color,
          transform,
          opacity: row * 0.1
        }
      }, [])

      rotZ -= angZ
      step += 1

      return dot
    }, row))
  }, Math.ceil(rows))

  return ol('.au-orb__face', {},
    dots
  );
}

function OrbCube (sources) {
  const sinks = {
    DOM: view(model(intent(sources), sources.props))
  }
  return sinks
}

export default sources => isolate(OrbCube)(sources)
