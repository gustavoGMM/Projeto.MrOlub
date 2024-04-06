function cadastrarPessoaFisica() {
    var nome = document.getElementById("nome").value;
    var cpf = document.getElementById("cpf").value;
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var confirmarSenha = document.getElementById("confirmarSenha").value;

    // Lógica de validação e cadastro aqui

    document.getElementById("messageFisica").innerText = "Cadastro de pessoa física realizado para " + nome + ".";
}

function cadastrarPessoaJuridica() {
    var razaoSocial = document.getElementById("razaoSocial").value;
    var cnpj = document.getElementById("cnpj").value;
    var nomeFantasia = document.getElementById("nomeFantasia").value;
    var email = document.getElementById("emailJuridica").value;
    var senha = document.getElementById("senhaJuridica").value;
    var confirmarSenha = document.getElementById("confirmarSenhaJuridica").value;

    // Lógica de validação e cadastro aqui

    document.getElementById("messageJuridica").innerText = "Cadastro de pessoa jurídica realizado para " + razaoSocial + ".";
}

function mostrarSenha(id) {
    var senhaInput = document.getElementById(id);
    var confirmarSenhaInput = document.getElementById("confirmar" + id.charAt(0).toUpperCase() + id.slice(1)); // Obtém o ID da confirmação de senha
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        confirmarSenhaInput.type = "text"; // Altera também a confirmação de senha para texto
    } else {
        senhaInput.type = "password";
        confirmarSenhaInput.type = "password"; // Altera também a confirmação de senha para password
    }
}

