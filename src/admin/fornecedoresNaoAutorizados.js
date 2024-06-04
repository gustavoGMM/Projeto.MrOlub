document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnConfirmar').addEventListener('click', autorizarFornecedor);
    document.getElementById('btnCancelar').addEventListener('click', fecharModal);
    document.getElementById('btnConfirmarAlteracao').addEventListener('click', confirmarAlteracaoChavePix);
    document.getElementById('btnCancelarAlteracao').addEventListener('click', fecharModalAlteracao);

    carregarFornecedoresNaoAutorizados();
    adicionarEventosDeAutorizacao();
});

function carregarFornecedoresNaoAutorizados() {
    fazerRequisicaoComToken('http://localhost:8080/admin/fornecedores/naoAutorizados', 'GET')
        .then(dados => popularTabelaNaoAutorizados(dados))
        .catch(error => console.error('Erro ao carregar os dados de fornecedores não autorizados:', error));
}

function popularTabelaNaoAutorizados(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = '';

    dados.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${item.cnpj || item.cpf}</td>
            <td>
                <input type="text" class="input-chave-pix" value="${item.chave}" data-id="${item.id}" readonly />
            </td>
            <td>${item.nomeFantasia}</td>
            <td>${mascaraTelefone(item.telefone)}</td>
            <td>${item.autorizado ? 'Autorizado' : 'Não Autorizado'}</td>
            <td>${item.dataConsulta || 'N/A'}</td>
            <td><button class="autorizarFornecedorBtn" data-id="${item.id}">Autorizar</button></td>
        `;
        tabela.appendChild(linha);

        const inputChavePix = linha.querySelector('.input-chave-pix');

        inputChavePix.addEventListener('click', function() {
            this.readOnly = false;
            this.style.border = '1px solid #ccc';
        });

        inputChavePix.addEventListener('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault();

                const fornecedorId = this.getAttribute('data-id');
                const novaChavePix = this.value;
                const fornecedor = linha.querySelector('td:nth-child(4)').textContent;

                exibirModalAlterarChavePix(fornecedorId, novaChavePix, fornecedor);
            }
        });

        inputChavePix.addEventListener('blur', function() {
            this.readOnly = true;
            this.style.border = 'none';
        });
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
            carregarFornecedoresNaoAutorizados();
            fecharModal();
        })
        .catch(error => console.error('Erro ao autorizar fornecedor:', error));
}

function mascaraCNPJ(cnpj) {
    if (!cnpj) return 'N/A';
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length > 14) cnpj = cnpj.substring(0, 14);

    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');

    return cnpj;
}

function mascaraTelefone(telefone) {
    telefone = telefone.replace(/[^\d]+/g, '');
    if (telefone.length > 11) telefone = telefone.substring(0, 11);

    telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d{4})/, '$1-$2');

    return telefone;
}

function exibirModalAlterarChavePix(fornecedorId, novaChavePix, fornecedor) {
    const modal = document.getElementById('modalConfirmacaoAlteracao');
    const mensagem = `Você tem certeza que deseja alterar a chave Pix de ${fornecedor} para "${novaChavePix}"?`;

    modal.querySelector('.modal-content p').textContent = mensagem;
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.setAttribute('data-nova-chave', novaChavePix);
    modal.style.display = 'block';
}

function fecharModalAlteracao() {
    const modal = document.getElementById('modalConfirmacaoAlteracao');
    modal.style.display = 'none';
}

function confirmarAlteracaoChavePix() {
    const modal = document.getElementById('modalConfirmacaoAlteracao');
    const fornecedorId = modal.getAttribute('data-fornecedor-id');
    const novaChavePix = modal.getAttribute('data-nova-chave');

    fecharModalAlteracao();
    atualizarChavePix(fornecedorId, novaChavePix);
}
