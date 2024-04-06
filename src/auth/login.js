// faz o botao mostrar e ocultar senha
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

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do formulário padrão
  
    const nomeDeUsuario = document.getElementById('nomeDeUsuario').value;
    const senhaDoUsuario = document.getElementById('senhaDoUsuario').value;
  
    fetch('http://localhost:8080/api/auth/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nomeDeUsuario: nomeDeUsuario,
            senhaDoUsuario: senhaDoUsuario
        })
    })
    .then(response => {
        if (!response.ok) {
            exibirMensagem('mensagemErro', 'Erro ao realizar o login. Por favor, verifique suas credenciais e tente novamente.');
            throw new Error('Erro ao realizar o login.');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('userToken', data.token);
        if (data.role === "FUNCIONARIO_ADMINISTRACAO") {
            window.location.href = "/pages/pagAdm/index.html"; 
        } else {
            exibirMensagem('mensagemErro', 'Usuário não tem autorização.');
        }
    })
    .catch(error => {
        console.error('Erro ao tentar fazer o login:', error);
    });
  });
  
  function exibirMensagem(idElemento, mensagem) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = mensagem;
    elemento.style.display = 'block';
  }
  