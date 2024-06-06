document.addEventListener('DOMContentLoaded', () => {
    const fornecedoresMaisColetadosData = [
        { fornecedor: 'Pamonha xyz', quantidadeColetada: 10000000 },
        { fornecedor: 'Fornecedor B', quantidadeColetada: 1000000 },
        { fornecedor: 'Fornecedor A', quantidadeColetada: 1},
    ];

    const valorPagoPorFornecedorData = [
        { fornecedor: 'Fornecedor B', valorPago: 3000 },
        { fornecedor: 'Fornecedor A', valorPago: 1500 },
        { fornecedor: 'Pamonha xyz', valorPago: 0 },
    ];
    

    const quantidadePorBairroData = [
        { endereco: 'Bairro Exemplo', quantidadeColetada: 1000000 },
        { endereco: 'Bairro Alto', quantidadeColetada: 100000 },
        { endereco: 'Vila Nova', quantidadeColetada: 1 },
    ];

    const colors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
    ];

    function renderFornecedoresMaisColetadosChart(data) {
        const ctx = document.getElementById('fornecedoresMaisColetadosChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.fornecedor),
                datasets: [{
                    label: 'Fornecedores mais coletados',
                    data: data.map(item => item.quantidadeColetada),
                    backgroundColor: colors[0],
                    borderColor: colors[0],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Fornecedores Mais Coletados'
                },
                legend: {
                    display: false
                }
            }
        });
    }

    function renderValorPagoPorFornecedorChart(data) {
        const ctx = document.getElementById('valorPagoPorFornecedorChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.fornecedor),
                datasets: [{
                    label: 'Valor pago por fornecedor',
                    data: data.map(item => item.valorPago),
                    backgroundColor: colors[1],
                    borderColor: colors[1],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Valor Pago por Fornecedor'
                },
                legend: {
                    display: false
                }
            }
        });
    }

    function renderQuantidadePorBairroChart(data) {
        const ctx = document.getElementById('quantidadePorBairroChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.endereco),
                datasets: [{
                    label: 'Quantidade por Bairro',
                    data: data.map(item => item.quantidadeColetada),
                    backgroundColor: colors[2],
                    borderColor: colors[2],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Quantidade por Bairro'
                },
                legend: {
                    display: false
                }
            }
        });
    }

    function loadAndRenderCharts() {
        renderFornecedoresMaisColetadosChart(fornecedoresMaisColetadosData);
        renderValorPagoPorFornecedorChart(valorPagoPorFornecedorData);
        renderQuantidadePorBairroChart(quantidadePorBairroData);
    }

    loadAndRenderCharts();
});