document.addEventListener("DOMContentLoaded", function() {
  const pixRequestsTable = document.getElementById("pixRequestsTable");

  // Função para renderizar a tabela de requisições de Pix
  function renderPixRequests(requests) {
      pixRequestsTable.innerHTML = "";
      requests.forEach(request => {
          const row = `
              <tr>
                  <td>${request.sender}</td>
                  <td>${request.amount}</td>
                  <td>${request.date}</td>
                  <td>${request.status}</td>
                  <td>
                      <button class="acceptBtn" data-sender="${request.sender}" data-amount="${request.amount}">Aceitar</button>
                      <button class="rejectBtn" data-sender="${request.sender}" data-amount="${request.amount}">Rejeitar</button>
                  </td>
              </tr>
          `;
          pixRequestsTable.innerHTML += row;
      });
  }

  // Função para lidar com o clique no botão "Aceitar"
  pixRequestsTable.addEventListener("click", function(event) {
      if (event.target.classList.contains("acceptBtn")) {
          const sender = event.target.getAttribute("data-sender");
          const amount = event.target.getAttribute("data-amount");
          // Aqui você pode implementar a lógica para lidar com a aceitação da requisição de Pix
          console.log(`Requisição de Pix de ${sender} no valor de ${amount} aceita`);
      }
  });

  // Função para lidar com o clique no botão "Rejeitar"
  pixRequestsTable.addEventListener("click", function(event) {
      if (event.target.classList.contains("rejectBtn")) {
          const sender = event.target.getAttribute("data-sender");
          const amount = event.target.getAttribute("data-amount");
          // Aqui você pode implementar a lógica para lidar com a rejeição da requisição de Pix
          console.log(`Requisição de Pix de ${sender} no valor de ${amount} rejeitada`);
      }
  });

  // Aqui você deve fazer uma solicitação ao backend para obter os dados das requisições de Pix
  // e chamar a função renderPixRequests com os dados recebidos
});
