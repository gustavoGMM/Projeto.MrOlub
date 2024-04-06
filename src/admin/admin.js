document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresNaoAutorizados();
});

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
            // Gustavo se tu manjar aqui é onde carrega os fornecedores não sei se tem algo que atualiza automatico sei la

            carregarFornecedoresNaoAutorizados();
        })
        .catch(error => {
            console.error('Erro ao autorizar fornecedor:', error);
        });
}
