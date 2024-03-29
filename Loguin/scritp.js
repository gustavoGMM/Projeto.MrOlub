<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    const ApiService = {
      baseURL: 'http://localhost:8080',

      httpClient: criarHttpClient(),

      async login(nomeDeUsuario, senhaDoUsuario) {
        try {
          const response = await this.request('/api/auth/user/login', 'POST', { nomeDeUsuario, senhaDoUsuario });
          this.setAuthorizationHeader(response.token, response.tipo);
          exibirMensagemSucesso('Login bem-sucedido!');
          return response;
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          exibirMensagemErro('Erro ao fazer login. Verifique suas credenciais.');
          throw error;
        }
      },

      async autorizarFornecedor(id) {
        try {
          const response = await this.request(`/admin/fornecedores/autorizar/${id}`, 'POST');
          return response;
        } catch (error) {
          console.error('Erro ao autorizar fornecedor:', error);
          throw error;
        }
      },

      async naoAutorizarFornecedor(id) {
        try {
          const response = await this.request(`/admin/fornecedores/nao-autorizados/${id}`, 'POST');
          return response;
        } catch (error) {
          console.error('Erro ao não autorizar fornecedor:', error);
          throw error;
        }
      },

      async request(endpoint, method = 'GET', data = null) {
        try {
          const url = `${this.baseURL}${endpoint}`;
          const options = {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null,
          };

          const response = await fetch(url, options);
          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || 'Erro na requisição.');
          }

          return responseData;
        } catch (error) {
          console.error('Erro na requisição:', error);
          throw error;
        }
      },

      setAuthorizationHeader(token, type) {
        this.httpClient.defaults.headers.common['Authorization'] = `${type} ${token}`;
      }
    };

    // Função para criar um cliente HTTP personalizado
    function criarHttpClient() {
      const httpClient = axios.create({
        baseURL: 'http://localhost:8080',
        timeout: 60000, // 1 minuto de timeout
      });

      // Adiciona o interceptor para logar as requisições
      httpClient.interceptors.request.use(function (config) {
        console.log('Requisição:', config);
        return config;
      });

      return httpClient;
    }

    // Funções para exibir mensagens de sucesso e erro
    function exibirMensagemSucesso(mensagem) {
      const mensagemSucesso = document.getElementById('mensagemSucesso');
      mensagemSucesso.innerText = mensagem;
      mensagemSucesso.classList.add('success');
      mensagemSucesso.classList.remove('error');
    }

    function exibirMensagemErro(mensagem) {
      const mensagemErro = document.getElementById('mensagemErro');
      mensagemErro.innerText = mensagem;
      mensagemErro.classList.add('error');
      mensagemErro.classList.remove('success');
    }

    // Evento de submit do formulário de login
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
      event.preventDefault();
      const nomeDeUsuario = document.getElementById('nomeDeUsuario').value;
      const senhaDoUsuario = document.getElementById('senhaDoUsuario').value;
      try {
        await ApiService.login(nomeDeUsuario, senhaDoUsuario);
        // Você pode adicionar redirecionamento ou outras ações após o login bem-sucedido
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        // Você pode adicionar tratamento adicional para o erro aqui, se necessário
      }
    });
  </script>
