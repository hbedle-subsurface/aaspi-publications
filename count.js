// GoatCounter counting for the hbedle-subsurface sites.
//
// Three jobs:
//   1. count a page view on load
//   2. count filter and search use as GoatCounter "events", so the dashboard
//      shows which topics, years, and terms people actually reach for
//   3. read the public view count back and print it in the footer
//
// Skipped on file://, on localhost, and in preview.html, so local checking
// stays out of the numbers.

(function () {
  var ENDPOINT = 'https://hbedle.goatcounter.com';
  var LABEL    = 'aaspi-publications';   // prefix on event names

  var TRACK_FILTERS  = true;   // topic, year, type, author clicks
  var TRACK_SEARCHES = true;   // searches, mapped to topic tags and author names
  var SHOW_COUNT     = true;   // print the view count in the footer

  var host = location.hostname;
  var local = location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';
  if (local || /preview\.html$/.test(location.pathname)) {
    window.aaspiCount = function () {};
    return;
  }

  /* ---- 1. page view ---- */
  var s = document.createElement('script');
  s.async = true;
  s.src = '//gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', ENDPOINT + '/count');
  document.head.appendChild(s);

  /* ---- 2. events, queued until count.js is ready ---- */
  var queue = [];
  var seen = {};

  window.aaspiCount = function (name, title) {
    if (!name) return;
    if (name.indexOf('search/') === 0 ? !TRACK_SEARCHES : !TRACK_FILTERS) return;
    if (seen[name]) return;          // once per visit, so counts are people not clicks
    seen[name] = true;
    queue.push({path: LABEL + '/' + name, title: title || name, event: true});
    flush();
  };

  function flush() {
    if (!(window.goatcounter && window.goatcounter.count)) return;
    while (queue.length) window.goatcounter.count(queue.shift());
  }

  var wait = setInterval(function () {
    if (window.goatcounter && window.goatcounter.count) { clearInterval(wait); flush(); }
  }, 300);
  setTimeout(function () { clearInterval(wait); }, 20000);

  /* ---- 3. the count, read back from the public counter endpoint ----
     Needs "Allow adding visitor counts on your website" switched on in the
     GoatCounter site settings; without it the request 404s and the footer
     line simply stays hidden. */
  if (!SHOW_COUNT) return;

  function put(el, text) { el.textContent = text; el.hidden = false; }

  function counterURL(range) {
    var p = encodeURIComponent(location.pathname);
    return ENDPOINT + '/counter/' + p + '.json' + (range ? '?start=' + range : '');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('viewcount');
    if (!el) return;
    Promise.all([
      fetch(counterURL()).then(function (r) { return r.ok ? r.json() : null; }),
      fetch(counterURL('month')).then(function (r) { return r.ok ? r.json() : null; })
    ]).then(function (res) {
      if (!res[0]) return;
      var all = res[0].count, month = res[1] && res[1].count;
      put(el, month
        ? 'Viewed ' + all + ' times, ' + month + ' of those in the past month.'
        : 'Viewed ' + all + ' times.');
    }).catch(function () {});
  });
})();
