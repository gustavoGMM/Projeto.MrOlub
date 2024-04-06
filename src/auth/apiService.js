// Função para fazer requisições à API incluindo o token de autenticação
// metodo(função em javãoscripto ;-;) que tem que ser utilizado em tudo que precisa do token :3
function fazerRequisicaoComToken(url, metodo, corpo = null) {
    const token = sessionStorage.getItem('userToken');
    const configuracoes = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (corpo) {
        configuracoes.body = JSON.stringify(corpo);
    }

    return fetch(url, configuracoes)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
}
