'use strict';

const brace = require('..');
require('../mode/css');
require('../mode/html');
require('../mode/javascript');
require('../mode/json');
require('../mode/typescript');
require('../theme/github');
require('../theme/monokai');
require('../theme/tomorrow_night');

window.StacklineBrace = brace;
