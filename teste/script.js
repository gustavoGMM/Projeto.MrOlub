document.addEventListener("DOMContentLoaded", function() {
    const pixRequestsTable = document.getElementById("pixRequestsTable");

    // Função para renderizar a tabela de requisições de Pix
    function renderPixRequests(requests) {
        pixRequestsTable.innerHTML = "";
        requests.forEach(request => {
            const row = `
                <tr>
                    <td>${request.id}</td>
                    <td>${request.cnpj}</td>
                    <td>${request.nomeMotorista}</td>
                    <td>${request.nomeFantasia}</td>
                    <td>${request.telefone}</td>
                    <td>${request.status}</td>
                    <td>${new Date().toLocaleDateString('pt-BR')}</td> <!-- Adiciona a data atual -->
                    <td>
                        <button class="confirmBtn" data-sender="${request.sender}" data-amount="${request.amount}">Sim</button>
                        <button class="rejectBtn" data-sender="${request.sender}" data-amount="${request.amount}">Não</button>
                    </td>
                </tr>
            `;
            pixRequestsTable.innerHTML += row;
        });
    }

    // Função para lidar com o clique no botão "Sim" (confirmar)
    pixRequestsTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("confirmBtn")) {
            const sender = event.target.getAttribute("data-sender");
            const amount = event.target.getAttribute("data-amount");
            // Mostrar o modal de confirmação
            confirmationModal.style.display = "block";
            // Definir a lógica para confirmar a liberação do Pix quando o botão "Sim" é clicado
            confirmButton.onclick = function() {
                console.log(`Requisição de Pix de ${sender} no valor de ${amount} confirmada`);
                // Aqui você pode implementar a lógica real para lidar com a confirmação da requisição de Pix
                // Por exemplo, enviar uma solicitação para o backend para liberar o Pix
                // Depois de lidar com a confirmação, feche o modal
                confirmationModal.style.display = "none";
            };
        }
    });

    // Função para lidar com o clique no botão "Não" (rejeitar)
    pixRequestsTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("rejectBtn")) {
            const sender = event.target.getAttribute("data-sender");
            const amount = event.target.getAttribute("data-amount");
            console.log(`Requisição de Pix de ${sender} no valor de ${amount} rejeitada`);
            // Aqui você pode implementar a lógica real para lidar com a rejeição da requisição de Pix
        }
    });

    // Fechar o modal quando o usuário clica no botão de fechar
    const closeButtons = document.getElementsByClassName("close");
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].onclick = function() {
            confirmationModal.style.display = "none";
        };
    }
});
