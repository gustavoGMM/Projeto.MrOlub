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

    // Simulação da chamada de API para validar o login usando Reqres.in
    fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Credenciais inválidas. Por favor, verifique seu e-mail e senha.');
      }
    })
    .then(data => {
      alert("Login bem-sucedido!");
      // Aqui você pode redirecionar o usuário para a página de destino após o login
    })
    .catch(error => {
      console.error('Erro ao fazer login:', error);
      alert("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.");
    });
  });
});
