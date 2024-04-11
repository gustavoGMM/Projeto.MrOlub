document.addEventListener('DOMContentLoaded', () => {
    carregarListaDeFuncionarios();
});

function carregarListaDeFuncionarios() {
    fazerRequisicaoComToken('http://localhost:8080/admin/listaDeFuncionariosColeta', 'GET')
        .then(dados => {
            popularTabelaFuncionarios(dados);
        })
        .catch(error => console.error('Erro ao carregar a lista de funcionários:', error));
}

function popularTabelaFuncionarios(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    dados.forEach(funcionario => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${funcionario.id}</td>
            <td>${funcionario.nomeDoContato}</td>
            <td>${funcionario.emailDoUsuario}</td>
            <td>${funcionario.telefone}</td>
            <td>${traduzirRole(funcionario.role)}</td>
            <td>${funcionario.valorAdiantado}</td>
            <td><button class="definirValorBtn" data-id="${funcionario.id}">Definir Valor</button></td>
        `;
        tabela.appendChild(linha);
    });

    adicionarEventosDefinirValor();
}

function adicionarEventosDefinirValor() {
    document.querySelectorAll('.definirValorBtn').forEach(botao => {
        botao.addEventListener('click', evento => {
            const funcionarioId = evento.target.getAttribute('data-id');
            // Aqui você poderia abrir um modal para definir o valor adiantado do PIX
            // ou diretamente um prompt/alert para inserir o valor, seguido pela função de atualização.
            let valor = prompt("Digite o valor adiantado para o PIX:");
            if(valor) {
                definirValorPIX(funcionarioId, valor);
            }
        });
    });
}

function definirValorPIX(funcionarioId, valor) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/definirLimitePix`, 'POST', {
        usuarioId: funcionarioId,
        valorAdiantado: valor
    })
    .then(() => {
        alert('Valor definido com sucesso.');
        carregarListaDeFuncionarios(); // Atualiza a lista para refletir a mudança
    })
    .catch(error => console.error('Erro ao definir valor do PIX:', error));
}

function traduzirRole(role) {
    // Adapte esta função conforme necessário para traduzir os roles de usuários
    const roles = {
        "FUNCIONARIO_COLETA_MOTORISTA": "Motorista",
        "FUNCIONARIO_COLETA_AJUDANTE": "Ajudante",
    };

    return roles[role] || role;
}
