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

function formatarParaMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function popularTabelaFuncionarios(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = '';  // Limpa a tabela antes de adicionar novos dados

    dados.forEach(funcionario => {
        const linha = document.createElement('tr');
        const valorFormatado = formatarParaMoeda(funcionario.valorAdiantado || 0);

        linha.innerHTML = `
            <td>${funcionario.id}</td>
            <td>${funcionario.nomeDoContato}</td>
            <td>${funcionario.emailDoUsuario}</td>
            <td>${funcionario.telefone}</td>
            <td>${traduzirRole(funcionario.role)}</td>
            <td>
                <input type="text" class="input-valor" value="${valorFormatado}" data-id="${funcionario.id}" readonly />
            </td>
        `;
        tabela.appendChild(linha);

        const inputValor = linha.querySelector('.input-valor');

        inputValor.addEventListener('click', function() {
            this.readOnly = false;  // Torna editável ao clicar
            this.style.border = '1px solid #ccc';  // Mostra a borda para indicar que é editável
        });

        inputValor.addEventListener('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault();  // Impede a ação padrão do Enter

                const valor = this.value;
                const id = this.getAttribute('data-id');
                const nome = linha.querySelector('td:nth-child(2)').textContent;  // Nome do funcionário

                exibirModalConfirmacaoValor(nome, valor, id, this);  // Exibe o modal para confirmação
            }
        });

        inputValor.addEventListener('blur', function() {
            this.readOnly = true;  // Torna o campo somente leitura ao perder o foco
            this.style.border = 'none';  // Remove a borda
        });
    });
}



function confirmarValor(nome, valor, id, inputElement) {
    // Remove a formatação antes de verificar e enviar
    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.').replace('R$', '').trim());
    
    if (!isNaN(valorNumerico)) {
        const confirmar = confirm(`Confirmar valor R$${valor} para ${nome}?`);
        if (confirmar) {
            definirValorPIX(id, valorNumerico, inputElement);
        } else {
            inputElement.readOnly = true;
            inputElement.classList.add('read-only');
        }
    } else {
        alert('Por favor, insira um valor numérico válido.');
    }
}

function definirValorPIX(funcionarioId, valor, inputElement) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/definirLimitePix`, 'POST', {
        usuarioId: funcionarioId,
        valorAdiantado: valor
    })
    .then(() => {
        alert('Valor definido com sucesso.');
        inputElement.readOnly = true; // Torna o campo somente leitura após confirmar
    })
    .catch(error => {
        console.error('Erro ao definir valor do PIX:', error);
        alert('Não foi possível definir o valor. Tente novamente.');
    });
}


function traduzirRole(role) {
    const roles = {
        "FUNCIONARIO_COLETA_MOTORISTA": "Motorista",
        "FUNCIONARIO_COLETA_AJUDANTE": "Ajudante",
    };

    return roles[role] || role;
}


function mascaraTelefone(tele)

function mascaraTelefone(telefone) {
    telefone = telefone.replace(/[^\d]+/g, '');
    if (telefone.length > 11) telefone = telefone.substring(0, 11);

    telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d{4})/, '$1-$2');

    return telefone;
}

function exibirModalConfirmacaoValor(nome, valor, id, inputElement) {
    const modal = document.getElementById('modalConfirmacaoValor');
    
    const valorFormatado = valor.replace("R$", "").trim(); 
    const mensagem = `Você tem certeza que deseja definir este valor de R$${valorFormatado} para ${nome}?`;
    
    modal.querySelector('.modal-content p').textContent = mensagem;  // Atualiza a mensagem do modal
    modal.setAttribute('data-nome', nome);
    modal.setAttribute('data-valor', valor);
    modal.setAttribute('data-id', id);
    modal.setAttribute('data-input', inputElement);
    modal.style.display = 'block';  // Exibe o modal
}


function fecharModalConfirmacaoValor() {
    const modal = document.getElementById('modalConfirmacaoValor');
    modal.style.display = 'none'; // Fecha o modal
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnConfirmarValor').addEventListener('click', () => {
        const modal = document.getElementById('modalConfirmacaoValor');
        const nome = modal.getAttribute('data-nome');
        const valor = modal.getAttribute('data-valor');
        const id = parseInt(modal.getAttribute('data-id'));
        const inputElement = modal.getAttribute('data-input');

        definirValorPIX(id, parseFloat(valor.replace('R$', '').trim()), inputElement); // Confirma o valor para o PIX
        fecharModalConfirmacaoValor(); // Fecha o modal após confirmação
    });

    document.getElementById('btnCancelarValor').addEventListener('click', fecharModalConfirmacaoValor); // Fecha o modal ao cancelar
});
