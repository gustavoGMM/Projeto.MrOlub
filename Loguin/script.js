document.getElementById('showPasswordBtn').addEventListener('click', function() {
  togglePasswordVisibility(true);
});

document.getElementById('hidePasswordBtn').addEventListener('click', function() {
  togglePasswordVisibility(false);
});

function togglePasswordVisibility(show) {
  const senhaDoUsuario = document.getElementById('senhaDoUsuario');
  const showPasswordBtn = document.getElementById('showPasswordBtn');
  const hidePasswordBtn = document.getElementById('hidePasswordBtn');
  
  if (show) {
      senhaDoUsuario.type = 'text';
      showPasswordBtn.style.display = 'none';
      hidePasswordBtn.style.display = 'block';
  } else {
      senhaDoUsuario.type = 'password';
      showPasswordBtn.style.display = 'block';
      hidePasswordBtn.style.display = 'none';
  }
}

// Função para fazer uma solicitação à API local
function fetchDataFromLocalhost() {
  fetch('http://localhost:8080/api/auth/user/login', {
      method: 'POST', // método POST para enviar dados de login
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username: document.getElementById('username').value, // Supondo que você tenha um campo de entrada com o ID 'username' para o nome de usuário
          password: document.getElementById('senhaDoUsuario').value // O valor do campo de senha
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erro ao realizar o login. Por favor, verifique suas credenciais e tente novamente.');
      }
      return response.json();
  })
  .then(data => {
      // Processar os dados recebidos da API
      console.log(data);
      // Aqui você pode fazer algo com os dados recebidos, como redirecionar o usuário para a próxima página ou exibir uma mensagem de sucesso
  })
  .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
      // Aqui você pode exibir uma mensagem de erro para o usuário informando que houve um problema ao tentar fazer o login
  });
}

