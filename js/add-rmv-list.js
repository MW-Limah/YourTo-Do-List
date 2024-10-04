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
        <div class="titles">
            <input class="input-task-title" placeholder="Digite o título da sua lista" id="list-title-${listId}">
        </div>
        <input class="input-task" placeholder="O que tenho que fazer...">
        <button class="button-add-task">Adicionar</button>
        <ul class="list-tasks"></ul>
    `;
    
    listContainers.appendChild(newListContainer);
    
    initializeList(newListContainer, listId);
    saveListTitle(listId);
    return listId;
}

// Função para salvar o título da lista no LocalStorage
function saveListTitle(listId) {
    const titleInput = document.getElementById(`list-title-${listId}`);
    
    // Recuperar título salvo no LocalStorage, se existir
    const savedTitle = localStorage.getItem(`Title-${listId}`);
    if (savedTitle) {
        titleInput.value = savedTitle;
    }

    // Salvar o título quando o input perder o foco ou ao pressionar "Enter"
    titleInput.addEventListener('blur', () => {
        localStorage.setItem(`Title-${listId}`, titleInput.value);
    });

    titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            localStorage.setItem(`Title-${listId}`, titleInput.value);
            titleInput.blur();
        }
    });
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
            localStorage.removeItem(`Title-${listToDelete}`);
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
