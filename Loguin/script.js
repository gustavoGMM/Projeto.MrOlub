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
  .then(response => response.json())
  .then(data => {
      // Processar os dados recebidos da API
      console.log(data);
  })
  .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
  });
}
