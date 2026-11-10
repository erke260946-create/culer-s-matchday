const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
const resultOf = (m) => (m.gf > m.ga ? 'W' : m.gf < m.ga ? 'L' : 'D');
const matchTitle = (m) => (m.venue === 'Home' ? `Barça vs ${m.opponent}` : `${m.opponent} vs Barça`);
const nextMatch = () => MATCHES
  .filter((m) => m.status === 'upcoming' && new Date(m.date) > new Date())
  .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

$(function () {
  $.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollToHash(hash) {
    if (!/^#[\w-]+$/.test(hash)) return false;
    const $target = $(hash);
    if (!$target.length) return false;
    $('html, body').stop(true).animate({ scrollTop: Math.max($target.offset().top - 90, 0) }, 600, function () {
      $target.attr('tabindex', '-1').trigger('focus');
    });
    return true;
  }
  $('a[href^="#"]').on('click', function (e) {
    if (scrollToHash(this.getAttribute('href'))) e.preventDefault();
  });
  $(window).on('load', function () { if (location.hash) scrollToHash(location.hash); });

  const $top = $('<button type="button" class="to-top" aria-label="Back to top">↑</button>').appendTo('body').hide();
  let topVisible = false;
  $(window).on('scroll', function () {
    const shouldShow = $(window).scrollTop() > 400;
    if (shouldShow === topVisible) return;      
    topVisible = shouldShow;
    $top.stop(true, true)[shouldShow ? 'fadeIn' : 'fadeOut'](200);
  });
  $top.on('click', function () { $('html, body').stop(true).animate({ scrollTop: 0 }, 500); });
});