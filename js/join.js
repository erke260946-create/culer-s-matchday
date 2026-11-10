$(function () {
  const form = document.getElementById('fan-form');
  const thisYear = new Date().getFullYear();
  const today = new Date();
  form.elements.birth.max = today.toISOString().slice(0, 10);

  PLAYERS.slice().sort((a, b) => a.number - b.number).forEach((p) => {
    const option = el('option', '', `${p.number} · ${p.name}`);
    option.value = p.number;
    form.elements.player.append(option);
  });

  const ageOn = (dateText) => {
    const born = new Date(dateText);
    let age = today.getFullYear() - born.getFullYear();
    if (today.getMonth() < born.getMonth() || (today.getMonth() === born.getMonth() && today.getDate() < born.getDate())) age--;
    return age;
  };

  const $card = $('#fan-card');
  function showPreview(name, playerNumber, since, id) {
    $('#card-name').text(name || 'Your name');
    const p = PLAYERS.find((x) => x.number === Number(playerNumber));
    $('#card-player').text(p ? `#${p.number} ${p.name}` : 'Pick a player');
    const year = Number(since);
    $('#card-since').text(Number.isInteger(year) && year >= 1899 && year <= thisYear ? `${year} · ${thisYear - year} years` : 'Enter a year');
    $('#card-id').text(id || 'Not issued yet');
    $card.toggleClass('issued', Boolean(id));
  }
  ['input', 'change'].forEach((type) => form.addEventListener(type, () => {
    const f = form.elements;
    showPreview(f.fullName.value.trim(), f.player.value, f.since.value, null);
  }));

  const R = Rules;
  const validator = Validate.attach(form, {
    fullName: [
      R.required('Please enter your full name'),
      R.minLength(2, 'Use at least 2 letters'),
      R.pattern(/^[\p{L}][\p{L}\s'’-]*$/u, 'Use letters only, without digits or symbols')
    ],
    email: [
      R.required('Please enter your email'),
      R.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a valid email, like name@example.com')
    ],
    phone: [
      R.required('Please enter your phone number'),
      R.pattern(/^\+?[0-9\s()-]+$/, 'Use only digits, spaces, + ( ) and -'),
      R.custom((v) => v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 15, 'The number must have 10 to 15 digits')
    ],
    birth: [
      R.required('Please choose your date of birth'),
      R.custom((v) => new Date(v) <= today, 'The date cannot be in the future'),
      R.custom((v) => ageOn(v) >= 13, 'You must be at least 13 years old'),
      R.custom((v) => ageOn(v) <= 110, 'Check the year, it looks too old')
    ],
    since: [
      R.required('Enter the year you became a fan'),
      R.integerBetween(1899, thisYear, `Enter a year between 1899 and ${thisYear}`),
      R.custom((v, input, f) => !f.elements.birth.value || Number(v) >= new Date(f.elements.birth.value).getFullYear(), 'You cannot be a fan before you were born')
    ],
    player: [R.required('Choose your favourite player')],
    password: [
      R.required('Please create a password'),
      R.minLength(8, 'Use at least 8 characters'),
      R.custom((v) => /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v), 'Add an uppercase letter, a lowercase letter and a number')
    ],
    confirm: [
      R.required('Repeat your password'),
      R.custom((v, input, f) => v === f.elements.password.value, 'The passwords do not match')
    ],
    terms: [R.required('Please accept the fan rules')]
  }, (data) => {
    const id = `CM-${thisYear}-${Math.floor(1000 + Math.random() * 9000)}`;
    showPreview(data.fullName, data.player, data.since, id);
    $card.stop(true, true).hide().fadeIn(500);         
    return `Welcome, ${data.fullName.split(' ')[0]}! Your Fan Card ID is ${id}.`;
  });

  form.elements.password.addEventListener('input', () => validator.revalidate('confirm'));
  form.elements.birth.addEventListener('input', () => validator.revalidate('since'));

  showPreview('', '', '', null);
});