// Evento de clique no botão "Mostrar Senha" e "Ocultar Senha"
document.getElementById('showPasswordBtn').addEventListener('click', function() {
    togglePasswordVisibility(true);
  });
  
  document.getElementById('hidePasswordBtn').addEventListener('click', function() {
    togglePasswordVisibility(false);
  });
  
  function togglePasswordVisibility(show) {
    const senhaDoUsuario = document.getElementById('senhaDoUsuario');
    const showPasswordBtn = document.getElementById('showPasswordBtn');
    const hidePasswordBtn = document.getElementById('hidePasswordBtn');
    
    if (show) {
      senhaDoUsuario.type = 'text';
      showPasswordBtn.style.display = 'none';
      hidePasswordBtn.style.display = 'block';
    } else {
      senhaDoUsuario.type = 'password';
      showPasswordBtn.style.display = 'block';
      hidePasswordBtn.style.display = 'none';
    }
  }
  