// Obtém o caminho da URL da página atual
var currentPath = window.location.pathname;

// Seleciona todos os links na barra de navegação
var links = document.querySelectorAll('.navbar a');

// Itera sobre os links
links.forEach(function(link) {
    // Obtém o caminho do link
    var linkPath = link.getAttribute('href');

    // Verifica se o caminho do link corresponde ao caminho da página atual
    if (linkPath === currentPath) {
        // Adiciona a classe de destaque ao link correspondente
        link.classList.add('active');
    }
});
