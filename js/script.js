let listCounter = 0;
const listContainers = document.getElementById('listContainers');
let listToDelete = null;

function createNewList(id = null) {
    const listId = id || ++listCounter;
    const newListContainer = document.createElement('div');
    newListContainer.className = 'container';
    newListContainer.id = `list-${listId}`;
    
    newListContainer.innerHTML = `
        <button class="delete-list-btn" onclick="confirmDeleteList(${listId})">Excluir</button>
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

document.getElementById('btnAdd').addEventListener('click', () => {
    const newListId = createNewList();
    updateListCounterInLocalStorage();
});

document.getElementById('confirmDelete').addEventListener('click', deleteList);
document.getElementById('cancelDelete').addEventListener('click', cancelDeleteList);

function initializeList(container, listId) {
    const button = container.querySelector('.button-add-task');
    const input = container.querySelector('.input-task');
    const listaCompleta = container.querySelector('.list-tasks');
    
    let minhaListaItens = [];
    let draggedItem = null;
    let selectedItem = null;

    function adicionarNovaTarefa() {
        if (input.value.trim() === '') {
            alert('Por favor, adicione uma tarefa!');
            return;
        }

        minhaListaItens.push({
            tarefa: input.value,
            concluido: false
        });

        input.value = '';
        mostrarTarefa();
    }

    function mostrarTarefa() {
        let novaLi = '';

        minhaListaItens.forEach((item, posicao) => {
            novaLi += `
                <li class="task ${item.concluido ? 'done' : ''}" 
                    draggable="true" 
                    ondragstart="dragStart${listId}(${posicao}, event)" 
                    ondragover="dragOver${listId}(event)" 
                    ondrop="drop${listId}(${posicao}, event)" 
                    ontouchstart="handleTouchStart${listId}(${posicao})" 
                    ontouchend="handleTouchEnd${listId}(${posicao})">
                    <img src="img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa${listId}(${posicao})">
                    <p id="tarefa-text-${listId}-${posicao}">${item.tarefa}</p>
                    <img src="img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem${listId}(${posicao})">
                    <button class="edit-btn" onclick="editarTarefa${listId}(${posicao})">Editar</button>
                </li>
            `;
        });

        listaCompleta.innerHTML = novaLi;
        localStorage.setItem(`Lista-${listId}`, JSON.stringify(minhaListaItens));
    }

    // Drag and drop functions
    window[`dragStart${listId}`] = function(posicao, event) {
        draggedItem = posicao;
        event.dataTransfer.effectAllowed = "move";
    };

    window[`dragOver${listId}`] = function(event) {
        event.preventDefault();  // Important: Prevent default to allow drop
        event.dataTransfer.dropEffect = "move";
    };

    window[`drop${listId}`] = function(posicao, event) {
        event.preventDefault();
        if (draggedItem === posicao) return;

        const itemArrastado = minhaListaItens[draggedItem];
        minhaListaItens.splice(draggedItem, 1);
        minhaListaItens.splice(posicao, 0, itemArrastado);

        mostrarTarefa();
    };

    // Touch functions for drag and drop on mobile
    window[`handleTouchStart${listId}`] = function(posicao) {
        selectedItem = posicao;
        setTimeout(() => {
            const selectedTask = document.querySelectorAll(`#list-${listId} .task`)[posicao];
            selectedTask.style.backgroundColor = "#6a6a6a";
        }, 200);  // Slight delay to distinguish touch
    };

    window[`handleTouchEnd${listId}`] = function(posicao) {
        if (selectedItem !== null && selectedItem !== posicao) {
            trocarItens(selectedItem, posicao);
            const previouslySelectedTask = document.querySelectorAll(`#list-${listId} .task`)[selectedItem];
            previouslySelectedTask.style.backgroundColor = "";
            selectedItem = null;
        }
    };

    function trocarItens(primeiro, segundo) {
        const itemSelecionado = minhaListaItens[primeiro];
        minhaListaItens[primeiro] = minhaListaItens[segundo];
        minhaListaItens[segundo] = itemSelecionado;
        mostrarTarefa();
    }

    window[`concluirTarefa${listId}`] = function(posicao) {
        minhaListaItens[posicao].concluido = !minhaListaItens[posicao].concluido;
        mostrarTarefa();
    };

    window[`deletarItem${listId}`] = function(posicao) {
        minhaListaItens.splice(posicao, 1);
        mostrarTarefa();
    };

    window[`editarTarefa${listId}`] = function(posicao) {
        const tarefaText = document.getElementById(`tarefa-text-${listId}-${posicao}`);
        const tarefaAntiga = minhaListaItens[posicao].tarefa;

        tarefaText.innerHTML = `<input class="edit-input" id="edit-input-${listId}-${posicao}" value="${tarefaAntiga}">`;

        const editInput = document.getElementById(`edit-input-${listId}-${posicao}`);
        editInput.focus();

        editInput.addEventListener('blur', () => salvarEdicao(posicao, editInput.value));
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                salvarEdicao(posicao, editInput.value);
            }
        });
    };

    function salvarEdicao(posicao, novaTarefa) {
        if (novaTarefa.trim() === '') {
            alert('O campo não pode estar vazio!');
            return;
        }

        minhaListaItens[posicao].tarefa = novaTarefa;
        mostrarTarefa();
    }

    function recarregarTarefas() {
        const tarefasDoLocalStorage = localStorage.getItem(`Lista-${listId}`);
        if (tarefasDoLocalStorage) {
            minhaListaItens = JSON.parse(tarefasDoLocalStorage);
            mostrarTarefa();
        }
    }

    recarregarTarefas();
    button.addEventListener('click', adicionarNovaTarefa);

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            adicionarNovaTarefa();
        }
    });
}


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

document.getElementById('btnRemove').addEventListener('click', function() {
    if (listCounter > 0) {
        const lastList = document.getElementById(`list-${listCounter}`);
        if (lastList) {
            confirmDeleteList(listCounter);
        }
    }
});

window.onload = loadSavedLists;

// ... (seu código
