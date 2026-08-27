'use strict';

const brace = require('../..');
require('../../mode/javascript');
require('../../theme/monokai');

const editor = brace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');
editor.session.setUseWorker(true);
editor.session.setValue('function broken( {');

document.body.dataset.editor = typeof editor.getValue === 'function' ? 'ready' : 'failed';
document.body.dataset.mode = editor.session.getMode().$id;
document.body.dataset.theme = editor.getTheme();
document.body.dataset.version = brace.version;
document.body.dataset.worker = 'pending';
document.body.dataset.workerUrl = brace.config.moduleUrl('ace/mode/javascript_worker', 'worker');

window.addEventListener('error', (event) => {
  document.body.dataset.browserError = event.message || 'unknown';
});

window.addEventListener('unhandledrejection', (event) => {
  document.body.dataset.browserError = String(event.reason || 'unhandled rejection');
});

editor.session.on('changeAnnotation', () => {
  const annotations = editor.session.getAnnotations();
  if (annotations.length > 0) {
    document.body.dataset.worker = 'annotated';
    document.body.dataset.annotationCount = String(annotations.length);
  }
});

setTimeout(() => {
  if (document.body.dataset.worker === 'pending') {
    document.body.dataset.worker = editor.session.$worker ? 'started-without-annotations' : 'not-started';
  }
}, 3500);
