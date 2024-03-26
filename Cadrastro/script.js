function cadastrarPessoaFisica() {
    var nome = document.getElementById("nome").value;
    var cpf = document.getElementById("cpf").value;
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var confirmarSenha = document.getElementById("confirmarSenha").value;

    // Lógica de validação e cadastro aqui

    document.getElementById("messageFisica").innerText = "Cadastro de pessoa física realizado " + nome + ".";
}

function cadastrarPessoaJuridica() {
    var razaoSocial = document.getElementById("razaoSocial").value;
    var cnpj = document.getElementById("cnpj").value;
    var nomeFantasia = document.getElementById("nomeFantasia").value;
    var email = document.getElementById("emailJuridica").value;
    var senha = document.getElementById("senhaJuridica").value;
    var confirmarSenha = document.getElementById("confirmarSenhaJuridica").value;

    // Lógica de validação e cadastro aqui

    document.getElementById("messageJuridica").innerText = "Cadastro de pessoa jurídica realizado " + razaoSocial + ".";
}

function mostrarSenha(id) {
    var senhaInput = document.getElementById(id);
    senhaInput.type = senhaInput.type === "password" ? "text" : "password";
}

