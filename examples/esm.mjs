import ace from '@stackline/brace';
import '@stackline/brace/mode/javascript.js';
import '@stackline/brace/theme/monokai.js';

const editor = ace.edit('editor');
editor.session.setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');
