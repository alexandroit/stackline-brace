'use strict';

// Preserve Ace's ordered, first-match /./ then segment/../ rewrites. A usual
// path stack is not equivalent (a/../././b historically becomes ./b).
// Linked segments and forward-only candidate queues visit each segment O(1)
// times, including paths with many dots or no slash before a long suffix.
module.exports = function normalizeRelativeModulePath(path) {
  var parts = path.split('/');
  var previous = [];
  var next = [];
  var dots = [];
  var parents = [];
  var first = 0;
  var dotIndex = 0;
  var parentIndex = 0;
  var index;
  for (index = 0; index < parts.length; index++) {
    previous[index] = index - 1;
    next[index] = index + 1 < parts.length ? index + 1 : -1;
    if (index > 0 && next[index] !== -1) {
      if (parts[index] === '.') dots.push(index);
      if (parts[index] === '..') parents.push(index);
    }
  }
  function remove(index) {
    var before = previous[index];
    var after = next[index];
    if (before === -1) first = after;
    else next[before] = after;
    if (after !== -1) previous[after] = before;
    next[index] = -2;
  }
  function valid(index) {
    return next[index] >= 0 && previous[index] !== -1;
  }
  while (dotIndex < dots.length || parentIndex < parents.length) {
    while (dotIndex < dots.length && !valid(dots[dotIndex])) dotIndex++;
    if (dotIndex < dots.length) remove(dots[dotIndex++]);
    while (parentIndex < parents.length &&
      (!valid(parents[parentIndex]) || parts[previous[parents[parentIndex]]] === '')) parentIndex++;
    if (parentIndex < parents.length) {
      index = parents[parentIndex++];
      remove(previous[index]);
      remove(index);
    }
  }
  var result = [];
  for (index = first; index !== -1; index = next[index]) result.push(parts[index]);
  return result.join('/');
};
