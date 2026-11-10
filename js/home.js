$(function () {

  const next = nextMatch();
  const $count = $('#countdown');
  if (!next) {
    $('#next-title').text('No match in the list yet');
    $('#next-info').text('Check the Matches page later.');
    $count.hide();
  } else {
    $('#next-title').text(matchTitle(next));
    $('#next-info').text(`${fmtDate(next.date)}, ${fmtTime(next.date)} UTC · ${next.competition}`);
    const target = new Date(next.date);
    const tick = () => {
      const s = Math.max(0, Math.floor((target - new Date()) / 1000));
      const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
      $count.find('b').each((i, b) => { b.textContent = String(parts[i]).padStart(2, '0'); });
    };
    tick();
    setInterval(tick, 1000);
  }

  const played = MATCHES.filter((m) => m.status === 'played');
  let wins = 0, goalsFor = 0, goalsAgainst = 0;
  for (const m of played) {
    if (m.gf > m.ga) wins++;
    goalsFor += m.gf;
    goalsAgainst += m.ga;
  }
  const stats = [['Matches played', played.length], ['Wins', wins], ['Goals scored', goalsFor], ['Goals conceded', goalsAgainst]];
  stats.forEach(([label, value]) => {
    const box = el('div', 'stat');
    const number = el('b', '', '0');
    box.append(number, el('span', '', label));
    $('#stats').append(box);
    $({ n: 0 }).animate({ n: value }, {
      duration: 900,
      step: (now) => { number.textContent = Math.round(now); },
      complete: () => { number.textContent = value; }
    });
  });

  WORDS.forEach((w, i) => {
    const item = el('div', 'word');
    const title = el('h3', 'word-title');
    const button = el('button', 'word-btn', w.term);
    button.type = 'button';
    button.id = `word-btn-${i}`;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `word-${i}`);
    const panel = el('div', 'word-body');
    panel.id = `word-${i}`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    panel.append(el('p', '', w.text));
    title.append(button);
    item.append(title, panel);
    document.getElementById('words').append(item);
  });

  $('#words').on('click', '.word-btn', function () {
    const isOpen = this.getAttribute('aria-expanded') === 'true';
    $('.word-btn[aria-expanded="true"]').not(this).each(function () {
      this.setAttribute('aria-expanded', 'false');
      $('#' + this.getAttribute('aria-controls')).stop(true, true).slideUp(200);
    });
    this.setAttribute('aria-expanded', String(!isOpen));
    const $panel = $('#' + this.getAttribute('aria-controls')).stop(true, true);
    if (isOpen) $panel.slideUp(250); else $panel.slideDown(250);
  });
});