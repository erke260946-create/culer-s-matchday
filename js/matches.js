$(function () {
  [...new Set(MATCHES.map((m) => m.competition))].forEach((c) => {
    const option = el('option', '', c);
    option.value = c;
    document.getElementById('m-comp').append(option);
  });

  function renderMatches() {
    const query = $('#m-search').val().trim().toLowerCase();
    const comp = $('#m-comp').val();
    const venue = $('#m-venue').val();
    const status = $('input[name="status"]:checked').val();
    const newestFirst = $('#m-sort').val() === 'new';

    const list = MATCHES
      .filter((m) => status === 'all' || m.status === status)
      .filter((m) => comp === 'all' || m.competition === comp)
      .filter((m) => venue === 'all' || m.venue === venue)
      .filter((m) => m.opponent.toLowerCase().includes(query))
      .sort((a, b) => (newestFirst ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)));

    const $body = $('#matches-body').empty();
    if (list.length === 0) {
      const row = el('tr');
      const cell = el('td');
      cell.colSpan = 6;
      const box = el('div', 'empty-state');
      box.append(el('strong', '', 'No matches found'), el('span', '', 'Try another team name or clear the filters.'));
      cell.append(box);
      row.append(cell);
      $body.append(row);
    }

    let w = 0, d = 0, l = 0, gf = 0, ga = 0;
    list.forEach((m) => {
      const row = el('tr');
      [fmtDate(m.date), m.competition, m.venue, m.opponent].forEach((text) => row.append(el('td', '', text)));
      const resultCell = el('td');
      const scoreCell = el('td');
      if (m.status === 'played') {
        const r = resultOf(m);
        const pill = el('span', `pill ${r}`, r);
        pill.title = { W: 'Win', D: 'Draw', L: 'Loss' }[r];
        resultCell.append(pill);
        scoreCell.append(el('strong', '', `${m.gf}-${m.ga}`));
        if (r === 'W') w++; else if (r === 'D') d++; else l++;
        gf += m.gf;
        ga += m.ga;
      } else {
        resultCell.textContent = `${fmtTime(m.date)} UTC`;
        scoreCell.textContent = '–';
      }
      row.append(resultCell, scoreCell);
      $body.append(row);
    });

    const playedCount = w + d + l;
    let summary = `${list.length} ${list.length === 1 ? 'match' : 'matches'} shown`;
    if (playedCount > 0) {
      summary += ` · ${w}W ${d}D ${l}L · goals ${gf}:${ga} · win rate ${Math.round((w / playedCount) * 100)}%`;
    }
    $('#m-summary').text(summary);
    $body.stop(true, true).hide().fadeIn(150);
  }

  $('#m-search').on('input', renderMatches);
  $('#m-comp, #m-venue, #m-sort, input[name="status"]').on('change', renderMatches);
  $('#m-reset').on('click', function () {
    $('#m-search').val('');
    $('#m-comp, #m-venue').val('all');
    $('#m-sort').val('new');
    $('#st-played').prop('checked', true);
    renderMatches();
  });
  renderMatches();

  const next = nextMatch();
  const form = document.getElementById('predict-form');
  if (!next) {
    $('#predict-title').text('Predictions are closed');
    $('#predict-info').text('There is no upcoming match in the list.');
    $(form).hide();
    return;
  }
  $('#predict-title').text(`Predict ${matchTitle(next)}`);
  $('#predict-info').text(`${fmtDate(next.date)}, ${fmtTime(next.date)} UTC · ${next.competition}`);
  $('#away-label').text(`${next.opponent} goals`);

  PLAYERS.filter((p) => p.position !== 'Goalkeeper' && p.position !== 'Defender').forEach((p) => {
    const option = el('option', '', p.name);
    option.value = p.name;
    form.elements.predScorer.append(option);
  });

  const predictions = [];
  const goals = Rules.integerBetween(0, 15, 'Enter a whole number from 0 to 15');
  Validate.attach(form, {
    predName: [
      Rules.required('Please enter your name'),
      Rules.minLength(2, 'Use at least 2 letters'),
      Rules.pattern(/^[\p{L}][\p{L}\s'’-]*$/u, 'Use letters only, without digits or symbols')
    ],
    predHome: [Rules.required('Enter the goals for Barça'), goals],
    predAway: [Rules.required(`Enter the goals for ${next.opponent}`), goals],
    predScorer: [Rules.required('Choose the first Barça scorer')]
  }, (data) => {
    predictions.push({ name: data.predName, home: Number(data.predHome), away: Number(data.predAway), scorer: data.predScorer });
    const $list = $('#pred-list').empty();
    predictions.forEach((p) => $list.append(el('li', '', `${p.name}: Barça ${p.home}-${p.away} ${next.opponent}, first scorer ${p.scorer}`)));
    const average = predictions.reduce((sum, p) => sum + p.home, 0) / predictions.length;
    $('#pred-avg').text(`Average prediction: ${average.toFixed(1)} goals for Barça (${predictions.length} saved)`);
    $('#predictions').stop(true, true).slideDown(250);
    return `Saved! ${data.predName}, your prediction is ${data.predHome}-${data.predAway}.`;
  });
});