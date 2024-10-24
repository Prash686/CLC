(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
              
              // Custom error handling example
              const invalidFields = form.querySelectorAll(':invalid');
              invalidFields.forEach(field => {
                  // You can customize how to display messages for each invalid field
                  // For example:
                  const errorMsg = `${field.previousElementSibling.innerText} is required.`;
                  field.setCustomValidity(errorMsg);
              });
          }

          form.classList.add('was-validated')
      }, false)
  })
})();
