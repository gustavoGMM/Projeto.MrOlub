const apiUrl = 'API VAI AQUI';  

async function fetchData(endpoint) {
    const response = await fetch(`${apiUrl}/${endpoint}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
    }
    return response.json();
}

async function getFornecedoresMaisColetados() {
    return fetchData('fornecedores-mais-coletados');
}

async function getValorPagoPorFornecedor() {
    return fetchData('valor-pago-por-fornecedor');
}

async function getQuantidadePorBairro() {
    return fetchData('quantidade-por-bairro');
}

function renderFornecedoresMaisColetadosChart(data) {
    const ctx = document.getElementById('fornecedoresMaisColetadosChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.fornecedor),
            datasets: [{
                label: 'Quantidade Coletada',
                data: data.map(item => item.quantidadeColetada),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
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
                label: 'Valor Pago',
                data: data.map(item => item.valorPago),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        }
    });
}

function renderQuantidadePorBairroChart(data) {
    const ctx = document.getElementById('quantidadePorBairroChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.endereco),
            datasets: [{
                label: 'Quantidade Coletada',
                data: data.map(item => item.quantidadeColetada),
                backgroundColor: data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`),
                borderColor: data.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
                borderWidth: 1
            }]
        }
    });
}

async function loadAndRenderCharts() {
    try {
        const [fornecedoresMaisColetados, valorPagoPorFornecedor, quantidadePorBairro] = await Promise.all([
            getFornecedoresMaisColetados(),
            getValorPagoPorFornecedor(),
            getQuantidadePorBairro()
        ]);

        renderFornecedoresMaisColetadosChart(fornecedoresMaisColetados);
        renderValorPagoPorFornecedorChart(valorPagoPorFornecedor);
        renderQuantidadePorBairroChart(quantidadePorBairro);
    } catch (error) {
        console.error('Erro ao carregar e renderizar gráficos', error);
    }
}

window.onload = loadAndRenderCharts;
