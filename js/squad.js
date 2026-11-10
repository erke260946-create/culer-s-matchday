$(function () {
  const byNumber = (n) => PLAYERS.find((p) => p.number === n);

  $('#lineup-note').text(`Starting XI from ${LINEUP.match}. Hover, tap or focus a shirt.`);
  const $info = $('#player-info');
  let currentNumber = null;

  function buildInfo(p) {
    const box = el('div', 'pcard');
    box.append(el('div', 'num', p.number), el('h3', '', p.name), el('p', 'mb-1 fw-bold', p.role ? `${p.position} · ${p.role}` : p.position));
    box.append(el('p', 'mb-1', `${p.country} · age ${p.age}`));
    box.append(el('p', 'mb-1', `At Barça since ${p.since}. Contract until ${p.contract}.`));
    if (p.academy) box.append(el('p', 'mb-0', 'Trained at La Masia, the club academy.'));
    return box;
  }
  function showPlayer(p) {
    if (currentNumber === p.number) return;     
    currentNumber = p.number;
    $info.stop(true, true).fadeOut(100, function () { $(this).empty().append(buildInfo(p)).fadeIn(150); });
  }

  LINEUP.rows.forEach((row) => {
    const line = el('div', 'line');
    row.forEach((number) => {
      const p = byNumber(number);
      const button = el('button', 'player');
      button.type = 'button';
      button.setAttribute('aria-label', `Number ${p.number}, ${p.name}`);
      if (number === LINEUP.raised) button.classList.add('raised');
      button.append(el('div', 'shirt', p.number), el('span', 'nm', p.short));
      ['mouseenter', 'focus', 'click'].forEach((type) => button.addEventListener(type, () => showPlayer(p)));
      line.append(button);
    });
    document.getElementById('pitch').append(line);
  });

  const sorters = {
    number: (a, b) => a.number - b.number,
    name: (a, b) => a.name.localeCompare(b.name),
    age: (a, b) => a.age - b.age,
    contract: (a, b) => a.contract - b.contract
  };

  function renderSquad() {
    const query = $('#q').val().trim().toLowerCase();
    const position = $('#pos').val();
    const list = PLAYERS
      .filter((p) => (position === 'all' || p.position === position))
      .filter((p) => p.name.toLowerCase().includes(query) || p.country.toLowerCase().includes(query))
      .sort(sorters[$('#sort').val()]);

    const $grid = $('#squad-grid').empty();
    if (list.length === 0) {
      const empty = el('div', 'col-12');
      const box = el('div', 'empty-state');
      box.append(el('strong', '', 'No players found'), el('span', '', 'Try another name or country, or clear the filters.'));
      empty.append(box);
      $grid.append(empty);
      $('#squad-count').text('0 players shown');
    } else {
      list.forEach((p) => {
        const col = el('div', 'col-6 col-md-4 col-lg-3');
        const card = el('article', 'sq-card');
        card.append(el('div', 'no', p.number), el('h3', '', p.name), el('p', '', p.position), el('p', '', `${p.country} · age ${p.age}`));
        col.append(card);
        $grid.append(col);
      });
      const average = list.reduce((sum, p) => sum + p.age, 0) / list.length;   
      $('#squad-count').text(`${list.length} players shown · average age ${average.toFixed(1)}`);
    }
    $grid.stop(true, true).hide().fadeIn(150);   
  }

  $('#q').on('input', renderSquad);
  $('#pos, #sort').on('change', renderSquad);
  $('#squad-reset').on('click', function () {
    $('#q').val('');
    $('#pos').val('all');
    $('#sort').val('number');
    renderSquad();
  });
  renderSquad();
});