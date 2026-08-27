'use strict';

const brace = window.StacklineBrace;
const editor = brace.edit('editor');
const language = document.querySelector('#language');
const theme = document.querySelector('#theme');
const wrap = document.querySelector('#wrap');
const workerStatus = document.querySelector('#worker-status');
const cursorPosition = document.querySelector('#cursor-position');
const copyInstall = document.querySelector('#copy-install');

const samples = {
  css: `:root {
  color-scheme: light dark;
}

.editor {
  display: grid;
  min-height: 24rem;
  border: 1px solid currentColor;
}`,
  html: `<main class="editor-shell">
  <label for="source">Source</label>
  <div id="source" aria-label="Code editor"></div>
</main>`,
  javascript: `function summarize(records) {
  return records.reduce((result, record) => {
    result.total += record.value;
    result.count += 1;
    return result;
  }, { total: 0, count: 0 });
}

console.log(summarize([{ value: 21 }, { value: 21 }]));`,
  json: `{
  "package": "@stackline/brace",
  "engine": "ace",
  "runtimeDependencies": 0,
  "workers": "inline"
}`,
  typescript: `type Release = {
  package: string;
  version: string;
  verified: boolean;
};

const release: Release = {
  package: '@stackline/brace',
  version: '{{PACKAGE_VERSION}}',
  verified: true
};`
};

editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');
editor.session.setValue(samples.javascript);
editor.session.setUseWorker(true);
editor.setOptions({
  fontSize: 14,
  showPrintMargin: false,
  tabSize: 2,
  useSoftTabs: true
});
editor.clearSelection();

language.addEventListener('change', () => {
  editor.session.setMode(`ace/mode/${language.value}`);
  editor.session.setValue(samples[language.value]);
  editor.clearSelection();
  workerStatus.value = 'Worker ready';
});

theme.addEventListener('change', () => {
  editor.setTheme(`ace/theme/${theme.value}`);
});

wrap.addEventListener('change', () => {
  editor.session.setUseWrapMode(wrap.checked);
});

editor.selection.on('changeCursor', () => {
  const position = editor.getCursorPosition();
  cursorPosition.textContent = `Ln ${position.row + 1}, Col ${position.column + 1}`;
});

editor.session.on('changeAnnotation', () => {
  const count = editor.session.getAnnotations().length;
  workerStatus.value = count === 0 ? 'Worker clean' : `${count} annotation${count === 1 ? '' : 's'}`;
});

copyInstall.addEventListener('click', async () => {
  const command = document.querySelector('#install-command').textContent;
  await navigator.clipboard.writeText(command);
  copyInstall.textContent = 'Copied';
  setTimeout(() => {
    copyInstall.textContent = 'Copy';
  }, 1600);
});
