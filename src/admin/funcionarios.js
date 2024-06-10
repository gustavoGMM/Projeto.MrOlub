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
    const tabela = $('#pixRequestsTable').DataTable();
    tabela.clear();  // Limpa a tabela antes de adicionar novos dados

    dados.forEach(funcionario => {
        const valorFormatado = formatarParaMoeda(funcionario.valorAdiantado || 0);

        tabela.row.add([
            funcionario.id,
            funcionario.nomeDoContato,
            funcionario.emailDoUsuario,
            funcionario.telefone,
            traduzirRole(funcionario.role),
            `<input type="text" class="input-valor" value="${valorFormatado}" data-id="${funcionario.id}" readonly />`
        ]).draw(false);
    });

    // Adicionar eventos de clique e blur aos inputs
    $('#pixRequestsTable tbody').on('click', '.input-valor', function() {
        const valorAtual = $(this).val();
        const valorNumerico = parseFloat(valorAtual.replace(/[^\d,-]/g, '').replace(',', '.'));
        $(this).prop('readonly', false).css('border', '1px solid #ccc');
        $(this).data('oldValue', valorAtual); // Salva o valor atual para restaurar se necessário
        $(this).val(valorNumerico.toFixed(2).replace('.', ',')); // Converte para valor numérico com 2 casas decimais
        $(this).mask('000.000.000.000.000,00', {reverse: true});
    });

    $('#pixRequestsTable tbody').on('keydown', '.input-valor', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const valor = $(this).val();
            const id = $(this).data('id');
            const nome = $(this).closest('tr').find('td:nth-child(2)').text();
            exibirModalConfirmacaoValor(nome, valor, id, this);
        }
    });

    $('#pixRequestsTable tbody').on('blur', '.input-valor', function() {
        const valor = $(this).cleanVal();
        if(valor) {
            $(this).val(formatarParaMoeda(valor / 100));
        } else {
            $(this).val($(this).data('oldValue')); // Restaura o valor antigo se nenhum novo valor for inserido
        }
        $(this).prop('readonly', true).css('border', 'none');
    });
}

function traduzirRole(role) {
    const roles = {
        "FUNCIONARIO_COLETA_MOTORISTA": "Motorista",
        "FUNCIONARIO_COLETA_AJUDANTE": "Ajudante",
    };

    return roles[role] || role;
}

function exibirModalConfirmacaoValor(nome, valor, id, inputElement) {
    const modal = $('#modalConfirmacaoValor');
    const valorFormatado = valor.replace(",", ".").trim(); 
    const mensagem = `Você tem certeza que deseja definir este valor de R$${valorFormatado} para ${nome}?`;
    
    modal.find('.modal-content p').text(mensagem);  // Atualiza a mensagem do modal
    modal.data('nome', nome);
    modal.data('valor', valor);
    modal.data('id', id);
    modal.data('input', inputElement);
    modal.modal('show');  // Exibe o modal
}

function fecharModalConfirmacaoValor() {
    $('#modalConfirmacaoValor').modal('hide'); // Fecha o modal
}

function definirValorPIX(funcionarioId, valor, inputElement) {
    fazerRequisicaoComToken(`http://localhost:8080/admin/definirLimitePix`, 'POST', {
        usuarioId: funcionarioId,
        valorAdiantado: valor
    })
    .then(() => {
        toastr.success('Valor definido com sucesso.');
        $(inputElement).prop('readonly', true).css('border', 'none'); // Torna o campo somente leitura após confirmar
        carregarListaDeFuncionarios(); // Recarrega a lista de funcionários para refletir as mudanças
    })
    .catch(error => {
        console.error('Erro ao definir valor do PIX:', error);
        toastr.error('Não foi possível definir o valor. Tente novamente.');
    });
}

$(document).ready(function() {
    $('#pixRequestsTable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json'
        },
        dom: 'Bfrtip',
        buttons: [
            { extend: 'csv', text: 'CSV' },
            { extend: 'excel', text: 'Excel' },
            { extend: 'pdf', text: 'PDF' },
            { extend: 'print', text: 'Imprimir' }
        ]
    });

    $('#btnConfirmarValor').on('click', function() {
        const modal = $('#modalConfirmacaoValor');
        const nome = modal.data('nome');
        const valor = modal.data('valor');
        const id = parseInt(modal.data('id'));
        const inputElement = modal.data('input');
        
        definirValorPIX(id, parseFloat(valor.replace('.', '').replace(',', '.')), inputElement); // Confirma o valor para o PIX
        fecharModalConfirmacaoValor(); // Fecha o modal após confirmação
    });

    $('#btnCancelarValor').on('click', fecharModalConfirmacaoValor); // Fecha o modal ao cancelar
});
