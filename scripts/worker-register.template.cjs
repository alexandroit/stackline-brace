/* Generated worker registration runtime. Do not edit worker/register.js directly. */
'use strict';

var registered = Object.create(null);

module.exports = function registerWorker(ace, worker) {
  if (!ace || !ace.config || !worker || !worker.id || !worker.src) return false;

  var options = ace.config.all();
  if (options.$moduleUrls && options.$moduleUrls[worker.id]) return false;
  if (registered[worker.id]) return true;

  var root = typeof window === 'object' ? window : typeof globalThis === 'object' ? globalThis : null;
  var Url = root && (root.URL || root.webkitURL);
  if (!root || typeof root.Blob !== 'function' || !Url || typeof Url.createObjectURL !== 'function') return false;

  var url = Url.createObjectURL(new root.Blob([worker.src], { type: 'application/javascript' }));
  ace.config.setModuleUrl(worker.id, url);
  registered[worker.id] = url;
  return true;
};

module.exports.registered = registered;
