import { log, climbToMatch } from 'util'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import xsConcat from 'xstream/extra/concat'

import {
  figure, figcaption, li, ol, pre
} from '@cycle/dom'

import {
  concat, reduce, times
} from 'ramda'

function toCoord (ev) {
  let boxSize = climbToMatch(ev.target, '.au-cube').clientWidth
  return {
    x: ((ev.x / boxSize) - 0.5) * 2,
    y: ((ev.y / boxSize) - 0.5) * 2,
    at: log.now(),
  }
}

// Sources => Actions (capture useful user events)
function intent (sources) {
  const domCube = sources.DOM.select('.au-cube');

  const dotTap$ = xs.merge(
    domCube.events('mousedown'),
    domCube.events('touchstart'),
  ).filter(
    ev => ev.target.classList.contains('au-orb__dot')
  ).map(toCoord)

  const point$ = xs.merge(
    domCube.events('mousemove'),
    domCube.events('touchmove'),
  ).map(toCoord).startWith({x: 0, y: 0})

  const spin$ = dotTap$.map(tap => point$.endWhen(
    xs.merge(
      domCube.events('mouseenter').filter(
        ev => ev.target.classList.contains('au-cube')
      ),
      domCube.events('mouseup'),
      domCube.events('touchend')
    )
  )).flatten()
  .fold((acc, ps) => {
    // const pos = (acc.fresh) ? ps : acc
    // const dur = ps.at - pos.at
    // const xd = (pos.x - ps.x)
    // const yd = (pos.y - ps.y)
    // const xv = dur ? xd / dur : 0
    // const yv = dur ? xd / dur : 0

    // TODO: Leverage distance & velocity to determine multiplied difference.

    return {
      at: ps.at,
      x: ps.x,
      y: ps.y,
      z: 0, // ps.z
    }
  }, {x: 0, y: 0, z: 0, fresh: true})
  .startWith({x: 0, y: 0, z: 0})

  let actions = {
    dotTap$,
    point$,
    spin$,
  }
  return actions
}

// Actions+Props => State (transform into values)
function model (actions, props$) {
  return xs.combine(
    props$,
    props$.map(props => props.time$).flatten(), // .time
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
    rot,
    point,

  ]) => {
    return figure(`.au-cube.au-cube--${props.id}`, {
      attrs: {
        tabindex: 0
      },
    }, [
      ol(`.au-orb.au-cube__orb`, {
        attrs: {
          tabindex: 0
        },
        style: {
          transform: `
            rotateX(${rot.x * 90}deg)
            rotateY(${rot.y * 90}deg)
            rotateZ(${rot.z * 90}deg)
          `
        },
      }, [
        li('.au-orb__hemi.au-hemi--north',
          ["#FFF", "#AAA", "#FFF", "#AAA", "#FFF", '#999']
          .map(color => OrbFace(6, 1.3, color))
        ),
        li('.au-orb__hemi.au-hemi--south',
          ["#F00", "#F0F", "#FF0", "#0FF", "#0F0", "#00F"]
          .map(color => OrbFace(6, 1.25, color))
        ),
      ]),
      figcaption('.au-cube__info', [
        pre('', `PX ${ point.x.toFixed(2) } PY ${ point.y.toFixed(2) }`),
        pre('', `X ${ rot.x.toFixed(2) }\nY ${ rot.y.toFixed(2) }\nZ ${rot.z}`),
        pre('', `F ${time.frame}\nS ${time.second}`),
      ])
    ])
  })
}

function randomDeg () {
  return (Math.random() * 720) - 360;
}

// Generate the markup and plot sphere-face positions.
function OrbFace (rows = 22, scale = 2, color = "#F22") {
  const RAD = rows * scale;
  const ROWS = rows + 1;

  let angX = (90 / (ROWS - 0.5));
  let rotX = 0, rotY = 0, rotZ = 0;
  let step = 1;
  let dots = [];

  times(row => {
    row += 1;
    let angY = 0; // Not sure if needed.
    let angZ = (60 / row);

    if (row > 1) {
      rotX -= angX;
    }
    rotY = 0;
    rotZ = 0;

    dots = concat(dots, times(col => {
      let transform = `
        translateY(-0.5em)
        rotateZ(${rotZ}deg)
        rotateX(${rotX}deg)
        translateZ(${RAD}em)
      `;

      let dot = li('.au-orb__dot', {
        attrs: {
          tabindex: 0,
        },
        style: {
          borderColor: color,
          transform,
        }
      }, []);

      rotZ -= angZ;
      step += 1;

      return dot;
    }, row))
  }, ROWS)

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
