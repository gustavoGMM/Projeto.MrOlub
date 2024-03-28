document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('URL_DA_API');
        if (!response.ok) {
            throw new Error('Erro ao carregar lista de itens.');
        }
        const data = await response.json();
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = ''; // Limpa a lista antes de preencher novamente
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.nome; // Suponha que cada item tenha uma propriedade 'nome'
            itemList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao carregar a lista de itens. Por favor, tente novamente mais tarde.');
    }
});
