// Bootstrap validation with whitespace check
(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // Trim whitespace-only comments before validation
      const textareas = form.querySelectorAll('textarea');
      textareas.forEach(area => {
        area.value = area.value.trim();
      });

      // 🚫 Prevent submission if invalid
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();
