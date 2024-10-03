// Eventos para Botões
document.getElementById('btnAdd').addEventListener('click', () => {
    const newListId = createNewList();
    updateListCounterInLocalStorage();
});

document.getElementById('confirmDelete').addEventListener('click', deleteList);
document.getElementById('cancelDelete').addEventListener('click', cancelDeleteList);

document.getElementById('btnRemove').addEventListener('click', function() {
    if (listCounter > 0) {
        const lastList = document.getElementById(`list-${listCounter}`);
        if (lastList) {
            confirmDeleteList(listCounter);
        }
    }
});

