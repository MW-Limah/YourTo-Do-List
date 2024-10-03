// Adicionar e Remover Lista
let listCounter = 0;
const listContainers = document.getElementById('listContainers');
let listToDelete = null;

function createNewList(id = null) {
    const listId = id || ++listCounter;
    const newListContainer = document.createElement('div');
    newListContainer.className = 'container';
    newListContainer.id = `list-${listId}`;
    
    newListContainer.innerHTML = `
        <button class="delete-list-btn" id="btnRemove" onclick="confirmDeleteList(${listId})">Excluir</button>
        <input class="input-task" placeholder="O que tenho que fazer...">
        <button class="button-add-task">Adicionar</button>
        <ul class="list-tasks"></ul>
    `;
    
    listContainers.appendChild(newListContainer);
    
    initializeList(newListContainer, listId);
    return listId;
}

function confirmDeleteList(listId) {
    listToDelete = listId;
    document.getElementById('confirmModal').style.display = 'block';
}

function deleteList() {
    if (listToDelete) {
        const listToRemove = document.getElementById(`list-${listToDelete}`);
        if (listToRemove) {
            listToRemove.remove();
            localStorage.removeItem(`Lista-${listToDelete}`);
            updateListCounterInLocalStorage();
        }
        listToDelete = null;
    }
    document.getElementById('confirmModal').style.display = 'none';
}

function cancelDeleteList() {
    listToDelete = null;
    document.getElementById('confirmModal').style.display = 'none';
}

function updateListCounterInLocalStorage() {
    const containers = document.querySelectorAll('.container');
    const maxId = Array.from(containers).reduce((max, container) => {
        const id = parseInt(container.id.split('-')[1]);
        return id > max ? id : max;
    }, 0);
    localStorage.setItem('listCounter', maxId.toString());
}
