# Migration

## Keep existing source imports

Install the Stackline package under the legacy package name:

```bash
npm install brace@npm:@stackline/brace@^1.0.2
```

Existing imports remain unchanged:

```js
const ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');
```

## Use the scoped name directly

```bash
npm install @stackline/brace
```

```js
const ace = require('@stackline/brace');
require('@stackline/brace/mode/javascript');
require('@stackline/brace/theme/monokai');
```

No worker URL configuration is required for bundled modes. An explicit URL set through `ace.config.setModuleUrl` continues to take precedence.
