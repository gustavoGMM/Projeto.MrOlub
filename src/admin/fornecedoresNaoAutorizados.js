document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnConfirmar').addEventListener('click', autorizarFornecedor);
    document.getElementById('btnCancelar').addEventListener('click', fecharModal);

    carregarFornecedoresNaoAutorizados();
    adicionarEventosDeAutorizacao();
});

function carregarFornecedoresNaoAutorizados() {
    fazerRequisicaoComToken('http://localhost:8080/admin/fornecedores/naoAutorizados', 'GET')
        .then(dados => {
            popularTabelaNaoAutorizados(dados);
        })
        .catch(error => console.error('Erro ao carregar os dados de fornecedores não autorizados:', error));
}

function popularTabelaNaoAutorizados(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    dados.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${item.cnpj}</td>
            <td>${item.nomeFantasia}</td>
            <td>${item.telefone}</td>
            <td>${item.autorizado ? 'Autorizado' : 'Não Autorizado'}</td>
            <td>${item.dataConsulta || 'N/A'}</td>
            <td><button class="autorizarFornecedorBtn" data-id="${item.id}">Autorizar</button></td>
        `;
        tabela.appendChild(linha);
    });

    adicionarEventosDeAutorizacao();
}

function adicionarEventosDeAutorizacao() {
    document.querySelectorAll('.autorizarFornecedorBtn').forEach(botao => {
        botao.addEventListener('click', evento => exibirModalConfirmacao(evento.target.getAttribute('data-id')));
    });
}

function exibirModalConfirmacao(fornecedorId) {
    const modal = document.getElementById('modalConfirmacao');
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.style.display = 'block';
}

function fecharModal() {
    const modal = document.getElementById('modalConfirmacao');
    modal.style.display = 'none';
}

function autorizarFornecedor() {
    const fornecedorId = document.getElementById('modalConfirmacao').getAttribute('data-fornecedor-id');
    fazerRequisicaoComToken(`http://localhost:8080/admin/fornecedores/autorizar/${fornecedorId}`, 'POST')
        .then(() => {
            console.log('Fornecedor autorizado com sucesso');
            carregarFornecedoresNaoAutorizados(); // Recarrega a lista após autorização
            fecharModal();
        })
        .catch(error => console.error('Erro ao autorizar fornecedor:', error));
}
