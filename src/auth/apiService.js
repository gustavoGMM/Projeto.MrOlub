function fazerRequisicaoComToken(url, metodo, corpo = null) {
    const token = sessionStorage.getItem('userToken');
    if (!token) {
        console.error('Token de autenticação não encontrado');
        return Promise.reject(new Error('Token de autenticação ausente'));
    }

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
                throw new Error(`Falha na requisição: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Se for JSON
            } else {
                return response.text(); // Se não for JSON, trate como texto
            }
        })
        .then(data => {
            console.log("Resposta recebida:", data);
            return data; // Retorna os dados recebidos
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            throw error; // Propaga o erro para o chamador
        });
}
