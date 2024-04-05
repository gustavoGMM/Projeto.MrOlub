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

    document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Evita o envio do formulário padrão

      // Obtém os valores dos campos de entrada
      const nomeDeUsuario = document.getElementById('nomeDeUsuario').value;
      const senhaDoUsuario = document.getElementById('senhaDoUsuario').value;

      // Envia a solicitação para a API local
      fetch('http://localhost:8080/api/auth/user/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nomeDeUsuario: nomeDeUsuario,
            senhaDoUsuario: senhaDoUsuario
          })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao realizar o login. Por favor, verifique suas credenciais e tente novamente.');
          }
          return response.json();
      })
      .then(data => {
          // Exibe mensagem de sucesso
          exibirMensagem('mensagemSucesso', 'Login bem-sucedido!');
      })
      .catch(error => {
          // Exibe mensagem de erro
          exibirMensagem('mensagemErro', error.message);
      });
    });

    // Função para exibir mensagem em um elemento
    function exibirMensagem(idElemento, mensagem) {
      const elemento = document.getElementById(idElemento);
      elemento.innerHTML = mensagem;
    }

     // // // // // // // // // // //

    app.post('/api/auth/user/login', (req, res) => {
    const { nomeDeUsuario, senhaDoUsuario } = req.body;

    // Verifique as credenciais do usuário
    if (validarCredenciais(nomeDeUsuario, senhaDoUsuario)) {
        const papelDoUsuario = obterPapelDoUsuario(nomeDeUsuario);

        // Verifique o papel do usuário
        if (papelDoUsuario === 'FUNCIONARIO_COLETA_MOTORISTA') {
            return res.status(403).json({ error: 'Acesso negado para este usuário.' });
        } else {
            // Autenticação bem-sucedida para outros papéis de usuário
            // Gere um token JWT ou crie a sessão do usuário, conforme necessário
            const token = gerarTokenJWT(nomeDeUsuario);
            return res.status(200).json({ token: token });
        }
    } else {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
});
