// URL da API de login
const loginEndpoint = 'http://localhost:8080/api/auth/user/login';
const autorizarEndpoint = 'http://localhost:8080/admin/fornecedores/autorizar/';
const naoAutorizarEndpoint = 'http://localhost:8080/admin/fornecedores/nao-autorizados/';

// Função para fazer login do usuário
function fazerLogin() {
    const dadosLogin = {
        nomeDeUsuario: 'marciaadmin',
        senhaDoUsuario: 'senha123'
    };

    fetch(loginEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Login falhou. Usuário ou senha incorretos.');
    })
    .then(data => {
        console.log('Login bem-sucedido:', data);
        // Após o login bem-sucedido, habilitar a funcionalidade de autorização/não autorização
        habilitarFuncionalidade();
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
    });
}

// Função para habilitar a funcionalidade de autorização/não autorização após o login bem-sucedido
function habilitarFuncionalidade() {
    // Adicionar evento de click aos botões de autorização/não autorização
    document.querySelectorAll('.autorizarButton').forEach(button => {
        button.addEventListener('click', function() {
            const fornecedorId = this.getAttribute('data-fornecedor-id');
            autorizarFornecedor(fornecedorId);
        });
    });

    document.querySelectorAll('.naoAutorizarButton').forEach(button => {
        button.addEventListener('click', function() {
            const fornecedorId = this.getAttribute('data-fornecedor-id');
            naoAutorizarFornecedor(fornecedorId);
        });
    });
}

// Função para enviar requisição para autorizar um fornecedor
function autorizarFornecedor(id) {
    fetch(autorizarEndpoint + id, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao autorizar fornecedor.');
        })
        .then(data => {
            console.log('Fornecedor autorizado:', data);
            atualizarListaFornecedores(); // Atualiza a lista após autorizar
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Função para enviar requisição para não autorizar um fornecedor
function naoAutorizarFornecedor(id) {
    fetch(naoAutorizarEndpoint + id, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao não autorizar fornecedor.');
        })
        .then(data => {
            console.log('Fornecedor não autorizado:', data);
            atualizarListaFornecedores(); // Atualiza a lista após não autorizar
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Exibir a lista de fornecedores registrados na inicialização da página
window.addEventListener('DOMContentLoaded', function() {
    // Inicia o processo de login do usuário ao carregar a página
    fazerLogin();
});

// Função para atualizar a lista de fornecedores na página
function atualizarListaFornecedores() {
    var listaFornecedores = document.getElementById('listaFornecedores');
    listaFornecedores.innerHTML = ''; // Limpar a lista antes de atualizar

    fornecedoresRegistrados.forEach(function(fornecedor) {
        var listItem = document.createElement('li');
        listItem.textContent = fornecedor.nome + ' (CNPJ: ' + fornecedor.cnpj + ', Chave Pix: ' + fornecedor.chavePix + ')';

        var autorizarButton = document.createElement('button');
        autorizarButton.textContent = 'Autorizar';
        autorizarButton.className = 'autorizarButton';
        autorizarButton.setAttribute('data-fornecedor-id', fornecedor.id);
        listItem.appendChild(autorizarButton);

        var naoAutorizarButton = document.createElement('button');
        naoAutorizarButton.textContent = 'Não Autorizar';
        naoAutorizarButton.className = 'naoAutorizarButton';
        naoAutorizarButton.setAttribute('data-fornecedor-id', fornecedor.id);
        listItem.appendChild(naoAutorizarButton);

        listaFornecedores.appendChild(listItem);
    });
}
