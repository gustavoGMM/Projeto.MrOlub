// Função para fazer requisições à API incluindo o token de autenticação
function fazerRequisicaoComToken(url, metodo, corpo = null) {
    const token = sessionStorage.getItem('userToken');
    const configuracoes = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (corpo) {
        configuracoes.body = JSON.stringify(corpo);
    }

    return fetch(url, configuracoes)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
}

function carregarFornecedoresNaoAutorizados() {
    fazerRequisicaoComToken('http://localhost:8080/admin/fornecedores/naoAutorizados', 'GET')
        .then(dados => {
            popularTabelaPix(dados);
        })
        .catch(error => {
            console.error('Erro ao carregar os dados de Pix:', error);
        });
}

function popularTabelaPix(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    dados.forEach(item => {
        const linha = document.createElement('tr');

        // Criação e adição das células na linha
        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${item.cnpj}</td>
            <td>${item.nomeFantasia}</td>
            <td>${item.telefone}</td>
            <td>${item.autorizado ? 'Autorizado' : 'Não Autorizado'}</td>
            <td>${item.dataConsulta}</td>
            <td><button class="autorizarFornecedorBtn" data-id="${item.id}">Autorizar</button></td>
        `;

        tabela.appendChild(linha);
    });

    // Adicionar eventos nos botões para autorizar fornecedores
    document.querySelectorAll('.autorizarFornecedorBtn').forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const fornecedorId = evento.target.getAttribute('data-id');
            autorizarFornecedor(fornecedorId);
        });
    });
}

function autorizarFornecedor(fornecedorId) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/fornecedores/autorizar/${fornecedorId}`, 'POST')
        .then(response => {
            console.log('Fornecedor autorizado com sucesso:', response);
            // Aqui você pode atualizar a lista de fornecedores não autorizados
            carregarFornecedoresNaoAutorizados();
        })
        .catch(error => {
            console.error('Erro ao autorizar fornecedor:', error);
        });
}


// Adiciona evento de clique aos botões de autorização

document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresNaoAutorizados();
    
    document.querySelectorAll('.autorizarFornecedorBtn').forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const fornecedorId = evento.target.getAttribute('data-id');
            exibirModalConfirmacao(fornecedorId);
        });
    });

    // Adiciona evento de clique ao botão "Sim" na modal de confirmação
    document.getElementById('btnConfirmar').addEventListener('click', () => {
        const fornecedorId = document.getElementById('modalConfirmacao').getAttribute('data-fornecedor-id');
        autorizarFornecedor(fornecedorId);
        fecharModal();
    });

    // Adiciona evento de clique ao botão "Cancelar" na modal de confirmação
    document.getElementById('btnCancelar').addEventListener('click', () => {
        fecharModal();
    });
});

function exibirModalConfirmacao(fornecedorId) {
    const modal = document.getElementById('modalConfirmacao');
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.style.display = 'block';
}

function fecharModal() {
    const modal = document.getElementById('modalConfirmacao');
    modal.style.display = 'none';
}
