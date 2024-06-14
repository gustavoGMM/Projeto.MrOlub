document.addEventListener('DOMContentLoaded', () => {
    carregarDadosColetas();
});

function carregarDadosColetas() {
    fazerRequisicaoComToken('https://clownfish-app-w3y3q.ondigitalocean.app/api/coletas/list', 'GET')
        .then(dados => {
            atualizarResumo(dados);
            criarGraficoFornecedoresMaisColetados(dados);
            criarGraficoValorPagoPorFornecedor(dados);
            criarGraficoQuantidadePorBairro(dados);
            criarGraficoColetasPorDia(dados);
            criarGraficoValoresPorDia(dados);
        })
        .catch(error => console.error('Erro ao carregar os dados das coletas:', error));
}

function atualizarResumo(dados) {
    const totalLitros = dados.reduce((total, coleta) => total + coleta.litrosColetados, 0);
    const totalPago = dados.reduce((total, coleta) => total + coleta.pago, 0);
    
    document.getElementById('totalLitros').textContent = totalLitros;
    document.getElementById('totalPago').textContent = formatarParaMoeda(totalPago);
}

function criarGraficoFornecedoresMaisColetados(dados) {
    const fornecedores = {};
    dados.forEach(coleta => {
        if (!fornecedores[coleta.nomeFornecedor]) {
            fornecedores[coleta.nomeFornecedor] = 0;
        }
        fornecedores[coleta.nomeFornecedor] += coleta.litrosColetados;
    });

    const labels = Object.keys(fornecedores);
    const data = Object.values(fornecedores);

    const ctx = document.getElementById('fornecedoresMaisColetadosChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Litros Coletados',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => value.toFixed(2),
                    color: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function criarGraficoValorPagoPorFornecedor(dados) {
    const fornecedores = {};
    dados.forEach(coleta => {
        if (!fornecedores[coleta.nomeFornecedor]) {
            fornecedores[coleta.nomeFornecedor] = 0;
        }
        fornecedores[coleta.nomeFornecedor] += coleta.pago;
    });

    const labels = Object.keys(fornecedores);
    const data = Object.values(fornecedores);

    const ctx = document.getElementById('valorPagoPorFornecedorChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor Pago (R$)',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => formatarParaMoeda(value),
                    color: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function criarGraficoQuantidadePorBairro(dados) {
    const bairros = {};
    dados.forEach(coleta => {
        const bairro = coleta.enderecoDTO.bairro;
        if (!bairros[bairro]) {
            bairros[bairro] = 0;
        }
        bairros[bairro] += coleta.litrosColetados;
    });

    const labels = Object.keys(bairros);
    const data = Object.values(bairros);

    const ctx = document.getElementById('quantidadePorBairroChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Litros Coletados',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => value.toFixed(2),
                    color: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function criarGraficoColetasPorDia(dados) {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const coletasPorDia = new Array(7).fill(0);
    const valoresPorDia = new Array(7).fill(0);
    const precoMedioPorDia = new Array(7).fill(0);

    dados.forEach(coleta => {
        const dia = new Date(coleta.dataColeta).getDay();
        coletasPorDia[dia] += coleta.litrosColetados;
        valoresPorDia[dia] += coleta.pago;
    });

    coletasPorDia.forEach((total, index) => {
        if (total !== 0) {
            precoMedioPorDia[index] = valoresPorDia[index] / total;
        }
    });

    const ctx = document.getElementById('coletasPorDiaChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dias,
            datasets: [
                {
                    label: 'Litros Coletados',
                    data: coletasPorDia,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Valor Pago (R$)',
                    data: valoresPorDia,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Preço Médio (R$/Litro)',
                    data: precoMedioPorDia,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    type: 'line',
                    fill: false,
                    yAxisID: 'precoMedioY'
                }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value, context) => {
                        if (context.dataset.label === 'Preço Médio (R$/Litro)') {
                            return value.toFixed(2);
                        }
                        return formatarParaMoeda(value);
                    },
                    color: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatarParaMoeda(value);
                        }
                    }
                },
                precoMedioY: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoValoresPorDia(dados) {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const valoresPorDia = new Array(7).fill(0);

    dados.forEach(coleta => {
        const dia = new Date(coleta.dataColeta).getDay();
        valoresPorDia[dia] += coleta.pago;
    });

    const ctx = document.getElementById('valoresPorDiaChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dias,
            datasets: [{
                label: 'Valor Pago (R$)',
                data: valoresPorDia,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => formatarParaMoeda(value),
                    color: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatarParaMoeda(value);
                        }
                    }
                }
            }
        }
    });
}

function formatarParaMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
