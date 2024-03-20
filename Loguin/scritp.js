document.addEventListener("DOMContentLoaded", function() {
  let passwordInput = document.getElementById('password');
  let showPasswordBtn = document.getElementById('showPasswordBtn');
  let hidePasswordBtn = document.getElementById('hidePasswordBtn');

  showPasswordBtn.addEventListener('click', function() {
    passwordInput.type = 'text';
    showPasswordBtn.style.display = 'none';
    hidePasswordBtn.style.display = 'inline-block';
  });

  hidePasswordBtn.addEventListener('click', function() {
    passwordInput.type = 'password';
    showPasswordBtn.style.display = 'inline-block';
    hidePasswordBtn.style.display = 'none';
  });
});
