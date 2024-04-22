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

function atualizarChavePix(fornecedorId, novaChavePix) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/${fornecedorId}/chavePix`, 'PUT', {
        novaChave: novaChavePix
    })
    .then(() => {
        console.log('Chave Pix atualizada com sucesso.');
        carregarFornecedoresAutorizados(); // Recarrega a tabela após a atualização
    })
    .catch(error => {
        console.error('Erro ao atualizar a chave Pix:', error);
        alert('Não foi possível atualizar a chave Pix. Tente novamente.');
    });
}



// Popula a tabela de fornecedores autorizados com os dados recebidos
function popularTabelaAutorizados(dados) {
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
            <td>${mascaraTelefone(item.telefone)}</td>
            <td>Autorizado</td>
            <td>${item.dataConsulta || 'N/A'}</td>
            <td><button class="desautorizarFornecedorBtn" data-id="${item.id}">Desautorizar</button></td>
        `;
        tabela.appendChild(linha);

        const inputChavePix = linha.querySelector('.input-chave-pix');

        // Permite a edição do campo de chave Pix ao clicar
        inputChavePix.addEventListener('click', () => {
            inputChavePix.readOnly = false;  // Permite edição
            inputChavePix.style.border = '1px solid #ccc';  // Mostra a borda
        });

        // Exibe o modal de confirmação da alteração da chave Pix
        inputChavePix.addEventListener('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault();  // Impede a ação padrão

                const fornecedorId = inputChavePix.getAttribute('data-id');
                const novaChavePix = inputChavePix.value;
                const nomeFantasia = linha.querySelector('td:nth-child(4)').textContent;  // Nome do fornecedor

                exibirModalAlteracaoPix(fornecedorId, novaChavePix, nomeFantasia);  // Exibe o modal
            }
        });

        inputChavePix.addEventListener('blur', () => {
            inputChavePix.readOnly = true;  // Torna o campo somente leitura ao perder o foco
            inputChavePix.style.border = 'none';  // Remove a borda
        });
    });
    adicionarEventosDeDesautorizacao();
}


// Adiciona eventos de clique para cada botão de desautorização, para abrir o modal de confirmação
function adicionarEventosDeDesautorizacao() {
    document.querySelectorAll('.desautorizarFornecedorBtn').forEach(botao => {
        botao.addEventListener('click', evento => {
            const fornecedorId = evento.target.getAttribute('data-id');
            exibirModalConfirmacao(fornecedorId);  // Exibe o modal para confirmar desautorização
        });
    });
}

// Exibe o modal de confirmação, configurando o ID do fornecedor para ser usado na desautorização
function exibirModalConfirmacao(fornecedorId) {
    const modal = document.getElementById('modalConfirmacao');
    modal.querySelector('.modal-content p').textContent = 'Você tem certeza que deseja desautorizar este fornecedor?';
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.style.display = 'block';  // Exibe o modal
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
            carregarFornecedoresAutorizados();  // Recarrega a lista após a desautorização
            fecharModal();  // Fecha o modal após a desautorização
        })
        .catch(error => console.error('Erro ao desautorizar fornecedor:', error));  // Lida com erros
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

// Evento para exibir o modal de alteração de chave Pix
function exibirModalAlteracaoPix(fornecedorId, novaChavePix, nomeFantasia) {
    const modal = document.getElementById('modalConfirmacaoAlteracaoPix');
    const mensagem = `Você tem certeza que deseja alterar a chave Pix de "${nomeFantasia}" para "${novaChavePix}"?`;

    modal.querySelector('.modal-content p').textContent = mensagem;  // Atualiza a mensagem do modal
    modal.setAttribute('data-fornecedor-id', fornecedorId);
    modal.setAttribute('data-nova-chave-pix', novaChavePix);
    modal.style.display = 'block';  // Exibe o modal
}


function fecharModalAlteracaoPix() {
    const modal = document.getElementById('modalConfirmacaoAlteracaoPix');
    modal.style.display = 'none';
}

function confirmarAlteracaoPix() {
    const modal = document.getElementById('modalConfirmacaoAlteracaoPix');
    const fornecedorId = modal.getAttribute('data-fornecedor-id');
    const novaChavePix = modal.getAttribute('data-nova-chave-pix');

    fecharModalAlteracaoPix();  // Fecha o modal após a confirmação
    atualizarChavePix(fornecedorId, novaChavePix);  // Atualiza a chave Pix no back-end
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnConfirmarAlteracaoPix').addEventListener('click', confirmarAlteracaoPix);
    document.getElementById('btnCancelarAlteracaoPix').addEventListener('click', fecharModalAlteracaoPix);
});

