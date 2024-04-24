document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresAutorizados();
});

function carregarFornecedoresAutorizados() {
    fazerRequisicaoComToken('URL_DO_SEU_ENDPOINT_ aqui joninha faz o teste :3', 'GET')
        .then(dados => {
            popularTabelaColetasDiarias(dados);
        })
        .catch(error => console.error('Erro ao carregar os fornecedores autorizados:', error));
}

function popularTabelaColetasDiarias(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = '';  // Limpa a tabela antes de adicionar novos dados

    dados.forEach(coleta => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${coleta.nomeMotorista}</td>
            <td>${coleta.nomeAjudante}</td>
            <td>${coleta.nomeFornecedor}</td>
            <td>${coleta.litrosColetados}</td>
            <td>${coleta.pago}</td>
            <td>${coleta.valorPagoPorLitro}</td>
            <td>${coleta.cco}</td>
            <td>${coleta.dataColeta}</td>
            <td>${coleta.status}</td>
        `;
        tabela.appendChild(linha);
    });
}

function fazerRequisicaoComToken(url, metodo, dados) {
    // Lógica para fazer a requisição com token
}