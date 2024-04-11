document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresAutorizados();
    // Adiciona eventos de clique para os botões "Confirmar" e "Cancelar" no modal
    document.getElementById('btnConfirmar').addEventListener('click', () => {
        const fornecedorId = document.getElementById('modalConfirmacao').getAttribute('data-fornecedor-id');
        desautorizarFornecedor(fornecedorId);
    });
    document.getElementById('btnCancelar').addEventListener('click', fecharModal);
});

// Carrega a lista de fornecedores autorizados da API e popula a tabela
function carregarFornecedoresAutorizados() {
    fazerRequisicaoComToken('http://localhost:8080/admin/fornecedores/autorizados', 'GET')
        .then(dados => popularTabelaAutorizados(dados))
        .catch(error => console.error('Erro ao carregar os dados dos fornecedores autorizados:', error));
}

// Popula a tabela de fornecedores autorizados com os dados recebidos
function popularTabelaAutorizados(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
    dados.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${item.cnpj}</td>
            <td>${item.nomeFantasia}</td>
            <td>${item.telefone}</td>
            <td>Autorizado</td>
            <td>${item.dataConsulta || 'N/A'}</td>
            <td><button class="desautorizarFornecedorBtn" data-id="${item.id}">Desautorizar</button></td>
        `;
        tabela.appendChild(linha);
    });
    adicionarEventosDeDesautorizacao();
}

// Adiciona eventos de clique para cada botão de desautorização, para abrir o modal de confirmação
function adicionarEventosDeDesautorizacao() {
    document.querySelectorAll('.desautorizarFornecedorBtn').forEach(botao => {
        botao.addEventListener('click', evento => {
            const fornecedorId = evento.target.getAttribute('data-id');
            exibirModalConfirmacao(fornecedorId);
        });
    });
}

// Exibe o modal de confirmação, configurando o ID do fornecedor para ser usado na desautorização
function exibirModalConfirmacao(fornecedorId) {
    const modal = document.getElementById('modalConfirmacao');
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.style.display = 'block';
}

// Fecha o modal de confirmação
function fecharModal() {
    const modal = document.getElementById('modalConfirmacao');
    modal.style.display = 'none';
}

// Envia a requisição para desautorizar o fornecedor selecionado e atualiza a lista após a confirmação
function desautorizarFornecedor(fornecedorId) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/fornecedores/cancelar/${fornecedorId}`, 'POST')
        .then(() => {
            console.log('Fornecedor desautorizado com sucesso');
            carregarFornecedoresAutorizados(); // Recarrega a lista
            fecharModal();
        })
        .catch(error => console.error('Erro ao desautorizar fornecedor:', error));
}
