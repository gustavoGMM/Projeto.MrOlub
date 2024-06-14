document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresNaoAutorizados();
    $('#btnConfirmar').on('click', autorizarFornecedor);
    $('#btnCancelar').on('click', () => $('#modalConfirmacao').modal('hide'));
    $('#btnConfirmarAlteracao').on('click', confirmarAlteracaoChavePix);
    $('#btnCancelar').on('click', () => $('#modalConfirmacaoAlteracao').modal('hide'));
});

function carregarFornecedoresNaoAutorizados() {
    fazerRequisicaoComToken('https://clownfish-app-w3y3q.ondigitalocean.app/admin/fornecedores/naoAutorizados', 'GET')
        .then(dados => popularTabelaNaoAutorizados(dados))
        .catch(error => console.error('Erro ao carregar os dados de fornecedores não autorizados:', error));
}

function popularTabelaNaoAutorizados(dados) {
    const tabela = $('#naoAutorizadosTable').DataTable();
    tabela.clear();

    dados.forEach(item => {
        tabela.row.add([
            item.id,
            item.cnpj || item.cpf,
            `<input type="text" class="input-chave-pix form-control" value="${item.chave}" data-id="${item.id}" readonly />`,
            item.nomeFantasia,
            mascaraTelefone(item.telefone),
            item.autorizado ? 'Autorizado' : 'Não Autorizado',
            item.dataConsulta || 'N/A',
            `<button class="btn btn-success autorizarFornecedorBtn" data-id="${item.id}">Autorizar</button>`
        ]).draw(false);

        const inputChavePix = $(`input[data-id="${item.id}"]`);

        inputChavePix.on('click', function() {
            $(this).prop('readonly', false).addClass('editable');
        });

        inputChavePix.on('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault();

                const fornecedorId = $(this).data('id');
                const novaChavePix = $(this).val();
                const fornecedor = $(this).closest('tr').find('td:nth-child(4)').text();

                exibirModalAlterarChavePix(fornecedorId, novaChavePix, fornecedor);
            }
        });

        inputChavePix.on('blur', function() {
            $(this).prop('readonly', true).removeClass('editable');
        });
    });

    adicionarEventosDeAutorizacao();
}

function adicionarEventosDeAutorizacao() {
    $('.autorizarFornecedorBtn').on('click', evento => {
        const fornecedorId = $(evento.target).data('id');
        exibirModalConfirmacao(fornecedorId);
    });
}

function exibirModalConfirmacao(fornecedorId) {
    const modal = $('#modalConfirmacao');
    modal.find('.modal-body p').text('Você tem certeza que deseja autorizar este fornecedor?');
    modal.data('fornecedorId', fornecedorId);
    modal.modal('show');
}

function fecharModal() {
    $('#modalConfirmacao').modal('hide');
}

function autorizarFornecedor() {
    const fornecedorId = $('#modalConfirmacao').data('fornecedorId');
    fazerRequisicaoComToken(`https://clownfish-app-w3y3q.ondigitalocean.app/admin/fornecedores/autorizar/${fornecedorId}`, 'POST')
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
    const modal = $('#modalConfirmacaoAlteracao');
    const mensagem = `Você tem certeza que deseja alterar a chave Pix de ${fornecedor} para "${novaChavePix}"?`;

    modal.find('.modal-body p').text(mensagem);
    modal.data('fornecedorId', fornecedorId);
    modal.data('novaChave', novaChavePix);
    modal.modal('show');
}

function confirmarAlteracaoChavePix() {
    const modal = $('#modalConfirmacaoAlteracao');
    const fornecedorId = modal.data('fornecedorId');
    const novaChavePix = modal.data('novaChave');

    atualizarChavePix(fornecedorId, novaChavePix);
    modal.modal('hide');
}

function atualizarChavePix(fornecedorId, novaChavePix) {
    fazerRequisicaoComToken(`https://clownfish-app-w3y3q.ondigitalocean.app/admin/${fornecedorId}/chavePix`, 'PUT', {
        novaChave: novaChavePix
    })
    .then(() => {
        console.log('Chave Pix atualizada com sucesso');
        carregarFornecedoresNaoAutorizados();
    })
    .catch(error => console.error('Erro ao atualizar a chave Pix:', error));
}
