document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedoresAutorizados();
});

function carregarFornecedoresAutorizados() {
    fazerRequisicaoComToken('URL_DO_SEU_ENDPOINT_ aqui joninha faz o teste :3', 'GET')
        .then(dados => {
            popularTabelaColetasDiarias(dados);
        })
        .catch(error => console.error('Erro ao carregar os fornecedores autorizados:', error));
}

function popularTabelaColetasDiarias(dados) {
    const tabela = document.getElementById('pixRequestsTable');
    tabela.innerHTML = '';  // Limpa a tabela antes de adicionar novos dados

    dados.forEach(coleta => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${coleta.nomeMotorista}</td>
            <td>${coleta.nomeAjudante}</td>
            <td>${coleta.nomeFornecedor}</td>
            <td>${coleta.litrosColetados}</td>
            <td>${coleta.pago}</td>
            <td>${coleta.valorPagoPorLitro}</td>
            <td>${coleta.cco}</td>
            <td>${coleta.dataColeta}</td>
            <td>${coleta.status}</td>
        `;
        tabela.appendChild(linha);
    });
}

function fazerRequisicaoComToken(url, metodo, dados) {
    // Lógica para fazer a requisição com token
}




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
