'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const registerWorker = require('../worker/register');
const javascriptWorker = require('../worker/javascript');

test('packages workers as self-contained source', () => {
  assert.equal(javascriptWorker.id, 'ace/mode/javascript_worker');
  assert.equal(typeof javascriptWorker.src, 'string');
  assert.equal(javascriptWorker.src.length > 1000, true);
  assert.match(javascriptWorker.src, /JavaScriptWorker/);
});

test('registers a Blob URL in a browser-like environment', () => {
  const previousWindow = global.window;
  const urls = Object.create(null);
  const blobs = [];
  global.window = {
    Blob: class TestBlob {
      constructor(parts, options) {
        blobs.push({ options, parts });
      }
    },
    URL: {
      createObjectURL() {
        return 'blob:stackline-javascript-worker';
      }
    }
  };

  const fakeAce = {
    config: {
      all: () => ({ $moduleUrls: urls }),
      setModuleUrl: (name, url) => {
        urls[name] = url;
        return url;
      }
    }
  };

  try {
    assert.equal(registerWorker(fakeAce, javascriptWorker), true);
    assert.equal(urls[javascriptWorker.id], 'blob:stackline-javascript-worker');
    assert.equal(blobs.length, 1);
    assert.equal(blobs[0].options.type, 'application/javascript');
  } finally {
    global.window = previousWindow;
  }
});

test('preserves a worker URL explicitly configured by a consumer', () => {
  const urls = { [javascriptWorker.id]: 'https://cdn.example.test/worker-javascript.js' };
  const fakeAce = {
    config: {
      all: () => ({ $moduleUrls: urls }),
      setModuleUrl: () => assert.fail('consumer URL must not be overwritten')
    }
  };

  assert.equal(registerWorker(fakeAce, javascriptWorker), false);
  assert.equal(urls[javascriptWorker.id], 'https://cdn.example.test/worker-javascript.js');
});
