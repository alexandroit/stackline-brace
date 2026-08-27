const ace = require('@stackline/brace');
require('@stackline/brace/mode/javascript');
require('@stackline/brace/theme/monokai');

const editor = ace.edit('editor');
editor.session.setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');
