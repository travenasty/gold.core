import {log} from 'util'
import isolate from '@cycle/isolate'

import {
  figure, figcaption, li, ol
} from '@cycle/dom'

import {
  concat, reduce, times
} from 'ramda'

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
    let angZ = 60 / row;

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
  const domSource = sources.DOM
  const props$ = sources.props

  // TODO: Extend from user defined defaults
  const state$ = props$
  .map(props => ({
      id: props.id,
      radius: 3,
      spin: {x: 0, y: 0, z: 0},
      fill: props.fill || 'rgba(128,128,128, 0.5)'
    })
  )
  .remember()

  const vdom$ = state$
  .map(state => {
    return figure(`.au-cube.au-cube--${state.id}`, {
      attrs: {
        tabindex: 0
      },
    }, [
      ol(`.au-orb.au-cube__orb`, {
        attrs: {
          tabindex: 0
        },
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

  const sinks = {
    DOM: vdom$
  }

  return sinks
}

export default sources => isolate(OrbCube)(sources)
