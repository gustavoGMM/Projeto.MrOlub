document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresAutorizados();
    $('#btnConfirmar').on('click', () => {
        const fornecedorId = $('#modalConfirmacao').data('fornecedorId');
        desautorizarFornecedor(fornecedorId);
    });
    $('#btnCancelar').on('click', () => $('#modalConfirmacao').modal('hide'));
    $('#btnConfirmarAlteracaoPix').on('click', confirmarAlteracaoPix);
    $('#btnCancelarAlteracaoPix').on('click', () => $('#modalConfirmacaoAlteracaoPix').modal('hide'));
});

function carregarFornecedoresAutorizados() {
    fazerRequisicaoComToken('https://clownfish-app-w3y3q.ondigitalocean.app/admin/fornecedores/autorizados', 'GET')
        .then(dados => popularTabelaAutorizados(dados))
        .catch(error => console.error('Erro ao carregar os dados dos fornecedores autorizados:', error));
}

function popularTabelaAutorizados(dados) {
    const tabela = $('#autorizadosTable').DataTable();
    tabela.clear();

    dados.forEach(item => {
        tabela.row.add([
            item.id,
            item.cnpj ? mascaraCNPJ(item.cnpj) : mascaraCPF(item.cpf),
            `<input type="text" class="input-chave-pix form-control" value="${item.chave}" data-id="${item.id}" readonly />`,
            item.nomeFantasia,
            mascaraTelefone(item.telefone),
            'Autorizado',
            item.dataConsulta || 'N/A',
            `<button class="btn btn-danger desautorizarFornecedorBtn" data-id="${item.id}">Desautorizar</button>`
        ]).draw(false);

        const inputChavePix = $(`input[data-id="${item.id}"]`);

        inputChavePix.on('click', () => {
            inputChavePix.prop('readonly', false);
            inputChavePix.addClass('editable');
        });

        inputChavePix.on('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault();
                const fornecedorId = $(this).data('id');
                const novaChavePix = $(this).val();
                const nomeFantasia = $(this).closest('tr').find('td:nth-child(4)').text();
                exibirModalAlteracaoPix(fornecedorId, novaChavePix, nomeFantasia);
            }
        });

        inputChavePix.on('blur', () => {
            inputChavePix.prop('readonly', true);
            inputChavePix.removeClass('editable');
        });
    });

    adicionarEventosDeDesautorizacao();
}

function adicionarEventosDeDesautorizacao() {
    $('.desautorizarFornecedorBtn').on('click', evento => {
        const fornecedorId = $(evento.target).data('id');
        exibirModalConfirmacao(fornecedorId);
    });
}

function desautorizarFornecedor(fornecedorId) {
    fazerRequisicaoComToken(`https://clownfish-app-w3y3q.ondigitalocean.app/fornecedores/cancelar/${fornecedorId}`, 'POST')
        .then(() => {
            console.log('Fornecedor desautorizado com sucesso');
            carregarFornecedoresAutorizados();
            $('#modalConfirmacao').modal('hide');
        })
        .catch(error => console.error('Erro ao desautorizar fornecedor:', error));
}

function exibirModalConfirmacao(fornecedorId) {
    const modal = $('#modalConfirmacao');
    modal.find('.modal-body p').text('Você tem certeza que deseja desautorizar este fornecedor?');
    modal.data('fornecedorId', fornecedorId);
    modal.modal('show');
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

function mascaraCPF(cpf) {
    if (!cpf) return 'N/A';
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length > 11) cpf = cpf.substring(0, 11);

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return cpf;
}

function mascaraTelefone(telefone) {
    telefone = telefone.replace(/[^\d]+/g, '');
    if (telefone.length > 11) telefone = telefone.substring(0, 11);

    telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d{4})/, '$1-$2');

    return telefone;
}

function exibirModalAlteracaoPix(fornecedorId, novaChavePix, nomeFantasia) {
    const modal = $('#modalConfirmacaoAlteracaoPix');
    const mensagem = `Você tem certeza que deseja alterar a chave Pix de "${nomeFantasia}" para "${novaChavePix}"?`;

    modal.find('.modal-body p').text(mensagem);
    modal.data('fornecedorId', fornecedorId);
    modal.data('novaChavePix', novaChavePix);
    modal.modal('show');
}

function confirmarAlteracaoPix() {
    const modal = $('#modalConfirmacaoAlteracaoPix');
    const fornecedorId = modal.data('fornecedorId');
    const novaChavePix = modal.data('novaChavePix');

    atualizarChavePix(fornecedorId, novaChavePix);
    modal.modal('hide');
}

function atualizarChavePix(fornecedorId, novaChavePix) {
    fazerRequisicaoComToken(`https://clownfish-app-w3y3q.ondigitalocean.app/admin/${fornecedorId}/chavePix`, 'PUT', {
        novaChave: novaChavePix
    })
    .then(() => {
        console.log('Chave Pix atualizada com sucesso');
        carregarFornecedoresAutorizados();
    })
    .catch(error => console.error('Erro ao atualizar a chave Pix:', error));
}
