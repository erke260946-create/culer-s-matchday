const Rules = {
  required: (msg) => (v, input) => ((input.type === 'checkbox' ? input.checked : v !== '') ? '' : msg),
  minLength: (n, msg) => (v) => (v.length >= n ? '' : msg),
  pattern: (re, msg) => (v) => (re.test(v) ? '' : msg),
  integerBetween: (min, max, msg) => (v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= min && n <= max ? '' : msg;
  },
  custom: (test, msg) => (v, input, form) => (test(v, input, form) ? '' : msg)
};

const Validate = {
  attach(form, schema, onValid) {
    const fields = Object.keys(schema).map((name) => form.elements[name]);
    const touched = new Set();
    const $success = $(form).find('.form-success');

    function validateField(input) {
      const value = input.type === 'password' ? input.value : input.value.trim();
      let message = '';
      for (const rule of schema[input.name]) {   
        message = rule(value, input, form);
        if (message) break;
      }
      document.getElementById(`${input.id}-error`).textContent = message;
      input.classList.toggle('is-invalid', message !== '');
      input.classList.toggle('is-valid', message === '' && value !== '');
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      return message === '';
    }

    fields.forEach((input) => {
      input.addEventListener('blur', () => { touched.add(input.name); validateField(input); });
      input.addEventListener('change', () => { touched.add(input.name); validateField(input); });
      input.addEventListener('input', () => {
        if (touched.has(input.name)) validateField(input);  
        if ($success.is(':visible')) $success.stop(true, true).slideUp(200);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      fields.forEach((input) => {
        touched.add(input.name);
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      const data = {};
      fields.forEach((i) => { data[i.name] = i.type === 'checkbox' ? i.checked : (i.type === 'password' ? i.value : i.value.trim()); });
      const message = onValid(data);

      form.reset();                                
      fields.forEach((i) => {
        i.classList.remove('is-valid', 'is-invalid');
        i.removeAttribute('aria-invalid');
        document.getElementById(`${i.id}-error`).textContent = '';
      });
      touched.clear();
      $success.stop(true, true).text(message).hide().slideDown(250);  
    });

    return { revalidate: (name) => { if (touched.has(name)) validateField(form.elements[name]); } };
  }
};