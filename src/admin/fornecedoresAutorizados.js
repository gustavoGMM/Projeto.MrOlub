document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresAutorizados();
    document.getElementById('btnConfirmar').addEventListener('click', () => {
        const fornecedorId = document.getElementById('modalConfirmacao').getAttribute('data-fornecedor-id');
        desautorizarFornecedor(fornecedorId);
    });
    document.getElementById('btnCancelar').addEventListener('click', fecharModal);
});

function carregarFornecedoresAutorizados() {
    fazerRequisicaoComToken('http://localhost:8080/admin/fornecedores/autorizados', 'GET')
        .then(dados => popularTabelaAutorizados(dados))
        .catch(error => console.error('Erro ao carregar os dados dos fornecedores autorizados:', error));
}

function popularTabelaAutorizados(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = '';

    dados.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${item.cnpj ? mascaraCNPJ(item.cnpj) : mascaraCPF(item.cpf)}</td>
            <td>
                <input type="text" class="input-chave-pix" value="${item.chave}" data-id="${item.id}" readonly />
            </td>
            <td>${item.nomeFantasia}</td>
            <td>${mascaraTelefone(item.telefone)}</td>
            <td>Autorizado</td>
            <td>${item.dataConsulta || 'N/A'}</td>
            <td><button class="desautorizarFornecedorBtn" data-id="${item.id}">Desautorizar</button></td>
        `;
        tabela.appendChild(linha);

        const inputChavePix = linha.querySelector('.input-chave-pix');

        inputChavePix.addEventListener('click', () => {
            inputChavePix.readOnly = false;
            inputChavePix.style.border = '1px solid #ccc';
        });

        inputChavePix.addEventListener('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault();

                const fornecedorId = inputChavePix.getAttribute('data-id');
                const novaChavePix = inputChavePix.value;
                const nomeFantasia = linha.querySelector('td:nth-child(4)').textContent;

                exibirModalAlteracaoPix(fornecedorId, novaChavePix, nomeFantasia);
            }
        });

        inputChavePix.addEventListener('blur', () => {
            inputChavePix.readOnly = true;
            inputChavePix.style.border = 'none';
        });
    });
    adicionarEventosDeDesautorizacao();
}

function adicionarEventosDeDesautorizacao() {
    document.querySelectorAll('.desautorizarFornecedorBtn').forEach(botao => {
        botao.addEventListener('click', evento => {
            const fornecedorId = evento.target.getAttribute('data-id');
            exibirModalConfirmacao(fornecedorId);
        });
    });
}

function desautorizarFornecedor(fornecedorId) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/fornecedores/cancelar/${fornecedorId}`, 'POST')
        .then(() => {
            console.log('Fornecedor desautorizado com sucesso');
            carregarFornecedoresAutorizados();
            fecharModal();
        })
        .catch(error => console.error('Erro ao desautorizar fornecedor:', error));
}

function exibirModalConfirmacao(fornecedorId) {
    const modal = document.getElementById('modalConfirmacao');
    modal.querySelector('.modal-content p').textContent = 'Você tem certeza que deseja desautorizar este fornecedor?';
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.style.display = 'block';
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
    const modal = document.getElementById('modalConfirmacaoAlteracaoPix');
    const mensagem = `Você tem certeza que deseja alterar a chave Pix de "${nomeFantasia}" para "${novaChavePix}"?`;

    modal.querySelector('.modal-content p').textContent = mensagem;
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.setAttribute('data-nova-chave-pix', novaChavePix);
    modal.style.display = 'block';
}

function fecharModal() {
    const modal = document.getElementById('modalConfirmacao');
    modal.style.display = 'none';
}

function fecharModalAlteracaoPix() {
    const modal = document.getElementById('modalConfirmacaoAlteracaoPix');
    modal.style.display = 'none';
}

function confirmarAlteracaoPix() {
    const modal = document.getElementById('modalConfirmacaoAlteracaoPix');
    const fornecedorId = modal.getAttribute('data-fornecedor-id');
    const novaChavePix = modal.getAttribute('data-nova-chave-pix');

    fecharModalAlteracaoPix();
    atualizarChavePix(fornecedorId, novaChavePix);
}
