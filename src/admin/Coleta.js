// Exemplo de dados para fornecedores mais coletados
const dadosFornecedoresMaisColetados = {
    fornecedorA: [100, 200, 300, 400, 500, 600, 700, 800],
    fornecedorB: [200, 300, 400, 500, 600, 700, 800, 900]
};

// Exemplo de dados para valor pago por fornecedor
const dadosValorPagoPorFornecedor = {
    cliente: [1000, 2000, 3000, 4000],
    fornecedorA: [1500, 2500, 3500, 4500],
    fornecedorB: [2000, 3000, 4000, 5000]
};

// Gráfico de fornecedores mais coletados
const fornecedoresMaisColetadosChart = new Chart(document.getElementById('fornecedoresMaisColetadosChart'), {
    type: 'bar',
    data: {
        labels: ['1', '10', '100', '1000', '10,000', '100,000', '1,000,000', '10,000,000'],
        datasets: [
            {
                label: 'Fornecedor A',
                data: dadosFornecedoresMaisColetados.fornecedorA,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Fornecedor B',
                data: dadosFornecedoresMaisColetados.fornecedorB,
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

// Gráfico de valor pago por fornecedor
const valorPagoPorFornecedorChart = new Chart(document.getElementById('valorPagoPorFornecedorChart'), {
    type: 'line',
    data: {
        labels: ['0 MIL', '1 MIL', '2 MIL', '3 MIL'],
        datasets: [
            {
                label: 'Cliente',
                data: dadosValorPagoPorFornecedor.cliente,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                lineTension: 0.1
            },
            {
                label: 'Fornecedor A',
                data: dadosValorPagoPorFornecedor.fornecedorA,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                lineTension: 0.1
            },
            {
                label: 'Fornecedor B',
                data: dadosValorPagoPorFornecedor.fornecedorB,
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
