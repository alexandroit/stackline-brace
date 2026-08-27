'use strict';

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  document.dispatchEvent(new CustomEvent('stackline:navigation', {
    detail: { href: link.href }
  }));
});
