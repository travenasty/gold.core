import {log} from 'util'
import isolate from '@cycle/isolate'
import fromEvent from 'xstream/extra/fromEvent'
import xs from 'xstream'

import {
  figure, figcaption, li, ol
} from '@cycle/dom'

import {
  concat, reduce, times
} from 'ramda'

// Sources => Actions (listen to user events
function intent (sources) {
  let actions = {
    spin$: sources.DOM.select('.au-orb').events('click')
    .startWith(null).map(ev => ({
      x: randomDeg(),
      y: randomDeg(),
      z: randomDeg(),
    }))
  }
  return actions
}

// Actions => State (process information)
function model (actions, props$) {
  return xs.combine(
    props$.map(props => ({
      id: props.id,
    })),
    actions.spin$.map(rot => {
      return {
        transform: `
          rotateX(${rot.x}deg)
          rotateY(${rot.y}deg)
          rotateZ(${rot.z}deg)
        `
      }
    })
  )
}

// ViewState => VirtualDOM (output to user)
function view (state$) {
  return state$.map(([
    props,
    orbStyle,
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
        style: orbStyle,
      }, [
        li('.au-orb__hemi.au-hemi--north',
          ["#FFF", "#AAA", "#FFF", "#AAA", "#FFF", "#AAA"]
          .map(color => OrbFace(5, 1.5, color))
        ),
        li('.au-orb__hemi.au-hemi--south',
          ["#F00", "#F0F", "#FF0", "#0FF", "#0F0", "#00F"]
          .map(color => OrbFace(6, 1.5, color))
        ),
      ]),
      figcaption('.au-cube__info',
        'CSS 3D Transformed HTML Sphere'
      )
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
        rotateZ(${rotZ}deg)
        rotateX(${rotX}deg)
        translateZ(${RAD}em)
      `;

      let dot = li('.au-orb__dot', {
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
