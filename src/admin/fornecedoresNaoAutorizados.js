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
        .then(dados => {
            popularTabelaNaoAutorizados(dados);
        })
        .catch(error => console.error('Erro ao carregar os dados de fornecedores não autorizados:', error));
}

function atualizarChavePix(fornecedorId, novaChavePix) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/${fornecedorId}/chavePix`, 'PUT', {
        novaChave: novaChavePix
    })
    .then(() => {
        console.log('Chave Pix atualizada com sucesso.');
        carregarFornecedoresNaoAutorizados(); 
    })
    .catch(error => {
        console.error('Erro ao atualizar a chave Pix:', error);
        alert('Não foi possível atualizar a chave Pix. Tente novamente.');
    });
}

function popularTabelaNaoAutorizados(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = ''; 

    dados.forEach(item => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${mascaraCNPJ(item.cnpj)}</td>
            <td>
                <input type="text" class="input-chave-pix" value="${item.chave}" data-id="${item.id}" readonly />
            </td>
            <td>${item.nomeFantasia}</td>
            <td>${item.telefone}</td>
            <td>${item.autorizado ? 'Autorizado' : 'Não Autorizado'}</td>
            <td>${item.dataConsulta || 'N/A'}</td>
            <td><button class="autorizarFornecedorBtn" data-id="${item.id}">Autorizar</button></td>
        `;
        tabela.appendChild(linha);

        const inputChavePix = linha.querySelector('.input-chave-pix');

        // Permite a edição da chave Pix ao clicar
        inputChavePix.addEventListener('click', function() {
            this.readOnly = false;  // Permite edição
            this.style.border = '1px solid #ccc';  // Mostra a borda para indicar que é editável
        });

        // Exibe o modal para confirmar a alteração da chave Pix
        inputChavePix.addEventListener('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault();  // Impede a ação padrão

                const fornecedorId = this.getAttribute('data-id');
                const novaChavePix = this.value;
                const fornecedor = linha.querySelector('td:nth-child(4)').textContent;  // Nome do fornecedor

                exibirModalAlterarChavePix(fornecedorId, novaChavePix, fornecedor);  // Exibe o modal de confirmação
            }
        });

        inputChavePix.addEventListener('blur', function() {
            this.readOnly = true;  // Torna o campo somente leitura após perder o foco
            this.style.border = 'none';  // Remove a borda
        });
    });

    adicionarEventosDeAutorizacao();  // Adiciona eventos para autorizar fornecedores
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

function mascaraCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove todos os caracteres não numéricos
    if (cnpj.length > 14) cnpj = cnpj.substring(0, 14); // Limita a 14 dígitos

    // Formato do CNPJ: 12.345.678/0001-23
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Adiciona o segundo ponto
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Adiciona a barra
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2'); // Adiciona o hífen

    return cnpj; // Retorna o CNPJ formatado
}

// Função para aplicar máscara ao telefone
function mascaraTelefone(telefone) {
    telefone = telefone.replace(/[^\d]+/g, ''); // Remove todos os caracteres não numéricos
    if (telefone.length > 11) telefone = telefone.substring(0, 11); // Limita a 11 dígitos

    // Formato do telefone: (12) 34567-8901
    telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2'); // Adiciona os parênteses e espaço
    telefone = telefone.replace(/(\d{5})(\d{4})/, '$1-$2'); // Adiciona o hífen entre DDD e número

    return telefone; // Retorna o telefone formatado
}


function exibirModalAlterarChavePix(fornecedorId, novaChavePix, fornecedor) {
    const modal = document.getElementById('modalConfirmacaoAlteracao');
    const mensagem = `Você tem certeza que deseja alterar a chave Pix de ${fornecedor} para "${novaChavePix}"?`;

    modal.querySelector('.modal-content p').textContent = mensagem;  // Atualiza a mensagem do modal
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.setAttribute('data-nova-chave', novaChavePix);
    modal.style.display = 'block';  // Exibe o modal
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
