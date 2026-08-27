'use strict';

var brace = require('..');
require('../mode/javascript');
require('../theme/monokai');

if (brace.version !== '1.44.0') throw new Error('unexpected Ace version');
if (typeof brace.edit !== 'function') throw new Error('edit is unavailable');
if (brace.acequire !== brace.require) throw new Error('loader aliases diverged');
if (typeof brace.acequire('ace/mode/javascript').Mode !== 'function') throw new Error('JavaScript mode is unavailable');

console.log('Runtime compatibility check passed.');
