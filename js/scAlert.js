// Função para verificar se o alerta já foi visualizado
function checkAlertStatus() {
    const dontShow = localStorage.getItem('dontShowAlert');

    if (!dontShow) {
        // Se "Não mostrar novamente" não foi selecionado, mostra o modal
        document.getElementById('alertModal').style.display = 'block';
    }
}

// Função para fechar o modal e armazenar a escolha do usuário
document.getElementById('closeAlert').addEventListener('click', function() {
    const dontShowAgain = document.getElementById('dontShowAgain').checked;

    if (dontShowAgain) {
        // Armazena no localStorage para não mostrar novamente
        localStorage.setItem('dontShowAlert', true);
    }

    // Fecha o modal
    document.getElementById('alertModal').style.display = 'none';
});

// Verifica o estado do alerta ao carregar a página
window.onload = checkAlertStatus;
