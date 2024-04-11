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
    tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

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
            this.readOnly = false; // Torna editável ao clicar
            this.classList.remove('read-only'); // Remove a classe read-only
            this.style.border = '1px solid #ccc'; // Mostra a borda para indicar editabilidade
        });

        document.addEventListener('input', function(evento) {
            if (evento.target.classList.contains('input-valor')) {
                let valor = evento.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
                valor = (valor / 100).toFixed(2) + ''; // Converte para decimal
                valor = valor.replace('.', ','); // Troca ponto por vírgula
                valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Adiciona ponto como separador de milhar
                evento.target.value = `R$ ${valor}`; // Adiciona R$ na frente
            }
        });

        inputValor.addEventListener('blur', function() {
            this.readOnly = true; // Volta ao estado somente leitura ao perder foco
            this.style.border = '1px solid #ccc';
        });

        inputValor.addEventListener('keydown', function(evento) {
            if (evento.key === 'Enter') {
                evento.preventDefault(); // Impede ação padrão do Enter
                confirmarValor(funcionario.nomeDoContato, this.value, funcionario.id, this);
            }
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
        inputElement.style.border = 'none'; // Remove a borda para parecer como texto
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
