document.addEventListener("DOMContentLoaded", function() {
    // Encontrando o botão de solicitar coleta
    var btnSolicitarColeta = document.querySelector('.btn-primary');

    // Adicionando um evento de clique ao botão
    btnSolicitarColeta.addEventListener('click', function() {
        // Redirecionando para a nova página
        window.location.href = "/solicita/index.html"; // Substitua "/solicita/index.html" com o URL da página desejada
        
        // Exibindo uma mensagem de sucesso após o redirecionamento
        var mensagemSucesso = document.createElement('div');
        mensagemSucesso.textContent = 'Solicitação enviada com sucesso!';
        mensagemSucesso.classList.add('alert', 'alert-success', 'mt-3', 'rounded', 'p-2', 'text-center');
        mensagemSucesso.style.fontSize = '14px'; // Reduzindo o tamanho da fonte
        mensagemSucesso.style.position = 'fixed'; // Fixando a posição
        mensagemSucesso.style.bottom = '20px'; // Posicionando a mensagem no rodapé
        mensagemSucesso.style.left = '50%'; // Centralizando horizontalmente
        mensagemSucesso.style.transform = 'translateX(-50%)'; // Centralizando horizontalmente
        document.body.appendChild(mensagemSucesso);
        
        // Definindo um temporizador para remover a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(function() {
            mensagemSucesso.remove(); // Removendo a mensagem
        }, 3000);
        
        // Atualizando dinamicamente o ano no rodapé
        var anoAtual = new Date().getFullYear();
        var rodapeAno = document.querySelector('.footer span');
        rodapeAno.textContent = '\u00A9 ' + anoAtual + ' Mr.Oluc Todos os direitos reservados.';
    });
});
