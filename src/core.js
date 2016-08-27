import {log} from './util';

const horizon = Horizon();
const baseNode = document.querySelector('.au-base');

log.info('liquid gold!');

horizon.onReady(function() {
  log.info('HORIZON READY');
  baseNode.innerHTML = '🜚 (GOLD BASE)';
});

baseNode.innerHTML = '…';
horizon.connect();

if (module.hot) {
  module.hot.accept();

  module.hot.dispose(function() {
    baseNode.parentNode.removeChild(baseNode);
  });
}
