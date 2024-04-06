function sendRecoveryEmail() {
    var email = document.getElementById("email").value;
    if (email.trim() === "") {
        document.getElementById("message").innerText = "Por favor, digite um e-mail válido.";
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "seu_script_de_envio_de_email.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                document.getElementById("message").innerText = "E-mail de recuperação enviado para " + email + ".";
            } else {
                document.getElementById("message").innerText = "Ocorreu um erro ao enviar o e-mail de recuperação.";
            }
        }
    };

    var data = JSON.stringify({ email: email });
    xhr.send(data);
}
