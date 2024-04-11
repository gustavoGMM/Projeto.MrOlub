
// Por enquanto só atualizando o nome de Usuario
document.addEventListener('DOMContentLoaded', () => {
    atualizarNomeDeUsuarioNaUI();
});

function atualizarNomeDeUsuarioNaUI() {
    const nomeDoContato = sessionStorage.getItem('nomeDoContato');
    if (nomeDoContato) {
        const elementoUsername = document.getElementById('username');
        if (elementoUsername) elementoUsername.textContent = nomeDoContato;
    }
}


