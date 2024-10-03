// Carregamento e Salvamento de Listas
function loadSavedLists() {
    const savedListCounter = localStorage.getItem('listCounter');
    if (savedListCounter) {
        listCounter = parseInt(savedListCounter);
        for (let i = 1; i <= listCounter; i++) {
            if (localStorage.getItem(`Lista-${i}`)) {
                createNewList(i);
            }
        }
    } else {
        createNewList();
    }
}

window.onload = loadSavedLists;
