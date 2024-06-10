document.addEventListener('DOMContentLoaded', () => {
    carregarColetasDiarias();
});

function carregarColetasDiarias() {
    toastr.info('Carregando coletas diárias...');
    fazerRequisicaoComToken('http://localhost:8080/api/coletas/list', 'GET')
        .then(dados => {
            popularTabelaColetasDiarias(dados);
            toastr.success('Coletas diárias carregadas com sucesso.');
        })
        .catch(error => {
            console.error('Erro ao carregar as coletas diárias:', error);
            toastr.error('Erro ao carregar as coletas diárias. Tente novamente.');
        });
}


function popularTabelaColetasDiarias(dados) {
    const tabela = $('#coletasTable').DataTable();
    tabela.clear();  // Limpa a tabela antes de adicionar novos dados

    dados.forEach(coleta => {
        tabela.row.add([
            coleta.nomeMotorista,
            coleta.nomeAjudante,
            coleta.nomeFornecedor,
            coleta.litrosColetados,
            coleta.pago ? 'Sim' : 'Não',
            formatarParaMoeda(coleta.valorPagoPorLitro),
            coleta.cco,
            coleta.dataColeta,
            coleta.status
        ]).draw(false);
    });
}

function formatarParaMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

$(document).ready(function() {
    $('#coletasTable').DataTable({
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
});



// Obtendo dados da API para fornecedores mais coletados
fetch('sua_url_da_api_para_fornecedores_mais_coletados')
    .then(response => response.json())
    .then(data => {
        const fornecedoresMaisColetadosChart = new Chart(document.getElementById('fornecedoresMaisColetadosChart'), {
            type: 'bar',
            data: {
                labels: ['1', '10', '100', '1000', '10,000', '100,000', '1,000,000', '10,000,000'],
                datasets: [
                    {
                        label: 'Fornecedor A',
                        data: data.fornecedorA,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Fornecedor B',
                        data: data.fornecedorB,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });

// Obtendo dados da API para valor pago por fornecedor
fetch('sua_url_da_api_para_valor_pago_por_fornecedor')
    .then(response => response.json())
    .then(data => {
        const valorPagoPorFornecedorChart = new Chart(document.getElementById('valorPagoPorFornecedorChart'), {
            type: 'line',
            data: {
                labels: ['0 MIL', '1 MIL', '2 MIL', '3 MIL'],
                datasets: [
                    {
                        label: 'Cliente',
                        data: data.cliente,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        lineTension: 0.1
                    },
                    {
                        label: 'Fornecedor A',
                        data: data.fornecedorA,
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',
                        lineTension: 0.1
                    },
                    {
                        label: 'Fornecedor B',
                        data: data.fornecedorB,
                        fill: false,
                        borderColor: 'rgb(54, 162, 235)',
                        lineTension: 0.1
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
