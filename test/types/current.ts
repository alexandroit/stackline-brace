import brace, { acequire, config, createEditSession, version } from '../../index.mjs';

const session = createEditSession('const current = true;', 'ace/mode/javascript');
session.setUseWorker(false);
config.set('loadWorkerFromBlob', true);
const loaded: unknown = acequire('ace/mode/javascript');
const sameVersion: string = version;
brace.createEditSession('');
void loaded;
void sameVersion;
