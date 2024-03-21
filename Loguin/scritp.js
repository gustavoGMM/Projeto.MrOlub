document.addEventListener("DOMContentLoaded", function() {
  let passwordInput = document.querySelector('input[name="password"]');
  let showPasswordBtn = document.getElementById('showPasswordBtn');
  let hidePasswordBtn = document.getElementById('hidePasswordBtn');
  let form = document.querySelector('.login-form');

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

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.querySelector('input[name="email"]').value;
    let password = document.querySelector('input[name="password"]').value;

    // teste da chamada de API para validar o login
    if (email === "usuario@teste.com" && password === "senha123") {
      alert("Login bem-sucedido!");
      // redirecionar pra a página de destino após o login
    } else {
      alert("Credenciais inválidas. Por favor, verifique seu e-mail e senha.");
    }
  });
});
