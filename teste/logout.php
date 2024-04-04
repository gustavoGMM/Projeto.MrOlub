<?php
// Inicia a sessão (se já não estiver iniciada)
session_start();

// Destroi todas as variáveis de sessão
$_SESSION = [];

// Invalida o cookie de sessão
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 86400, '/');
}

// Finaliza a sessão
session_destroy();

// Redireciona o usuário de volta para a página de login (substitua "login.php" pelo caminho correto)
header("Location: login.php");
exit;
?>
