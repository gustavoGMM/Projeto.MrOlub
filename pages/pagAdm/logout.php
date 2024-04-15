<?php
// Inicia a sessão
session_start();

// Destroi todas as variáveis de sessão
session_destroy();

// Redireciona para a página de login
echo "<script>window.location.href = '/pages/Loguin/loguin.html';</script>";
exit;
?>
