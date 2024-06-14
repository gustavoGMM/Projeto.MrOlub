
function fazerLogin(nomeDeUsuario, senhaDoUsuario) {
    return fetch('https://clownfish-app-w3y3q.ondigitalocean.app/api/auth/user/login', {
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
            throw new Error('Erro ao realizar o login.');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('userToken', data.token);
        sessionStorage.setItem('nomeDoContato', data.nomeDoContato);
        atualizarNomeDeUsuario(data.nomeDoContato);
        return data;
    });
}

//Atualzia o nome do usuário no campo username
function atualizarNomeDeUsuario(nomeDoContato) {
    const elementoUsername = document.getElementById('username');
    if (elementoUsername) elementoUsername.textContent = nomeDoContato;
}


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

// Função para exibir mensagens de erro
function exibirMensagem(idElemento, mensagem) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = mensagem;
    elemento.style.display = 'block';
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const nomeDeUsuario = document.getElementById('nomeDeUsuario').value;
    const senhaDoUsuario = document.getElementById('senhaDoUsuario').value;

    fazerLogin(nomeDeUsuario, senhaDoUsuario)
    .then(data => {
        if (data.role === "FUNCIONARIO_ADMINISTRACAO") {
            window.location.href = "/pages/pagAdm/Home/home.html"; 
        } else {
            exibirMensagem('mensagemErro', 'Usuário não tem autorização.');
        }
    })
    .catch(error => {
        console.error('Erro ao tentar fazer o login:', error);
        exibirMensagem('mensagemErro', 'Erro ao realizar o login. Por favor, verifique suas credenciais e tente novamente.');
    });
});
