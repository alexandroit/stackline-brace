import brace = require('../..');

declare function require(path: string): unknown;

require('../../mode/javascript');
require('../../theme/monokai');

const session = brace.createEditSession('const answer = 42;', 'ace/mode/javascript');
session.setUseWorker(false);
const editor: brace.Editor = brace.edit(document.createElement('div'));
editor.setSession(session);
editor.setFontSize('14px');
editor.setFontSize(16);
brace.config.set('loadWorkerFromBlob', true);
const mode = brace.acequire('ace/mode/javascript') as { Mode: new () => brace.TextMode };
new mode.Mode();
const version: string = brace.version;
void version;
