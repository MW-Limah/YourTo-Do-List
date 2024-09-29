let listCounter = 0;
const listContainers = document.getElementById('listContainers');

function createNewList() {
    listCounter++;
    const newListContainer = document.createElement('div');
    newListContainer.className = 'container';
    newListContainer.id = `list-${listCounter}`;
    
    newListContainer.innerHTML = `
        <input class="input-task" placeholder="O que tenho que fazer...">
        <button class="button-add-task">Adicionar</button>
        <ul class="list-tasks"></ul>
    `;
    
    listContainers.appendChild(newListContainer);
    
    initializeList(newListContainer, listCounter);
}

function initializeList(container, listId) {
    const button = container.querySelector('.button-add-task');
    const input = container.querySelector('.input-task');
    const listaCompleta = container.querySelector('.list-tasks');
    
    let minhaListaItens = [];
    let dragTimeout = null;
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
                    onmousedown="startDrag${listId}(${posicao}, event)" 
                    onmouseup="cancelDrag${listId}()" 
                    ondragstart="dragStart${listId}(${posicao})" 
                    ondragover="dragOver(event)" 
                    ondrop="drop${listId}(${posicao})" 
                    ontouchstart="handleTouchStart${listId}(${posicao})" 
                    ontouchend="handleTouchEnd${listId}(${posicao})">
                    <img src="img/checked.png" alt="check-na-tarefa"onclick="concluirTarefa${listId}(${posicao})">
                    <p id="tarefa-text-${listId}-${posicao}">${item.tarefa}</p>
                    <img src="img/trash.png" alt="tarefa-para-o-lixo"  onclick="deletarItem${listId}(${posicao})">
                    <button class="edit-btn" onclick="editarTarefa${listId}(${posicao}), selecionarTexto()">Editar</button>
                </li>
            `;
        });

        listaCompleta.innerHTML = novaLi;
        localStorage.setItem(`Lista-${listId}`, JSON.stringify(minhaListaItens));
    }

    window[`startDrag${listId}`] = function(posicao, event) {
        dragTimeout = setTimeout(() => {
            const taskItem = event.target;
            draggedItem = posicao;
            taskItem.classList.add('draggable');
        }, 1000);
    };

    window[`cancelDrag${listId}`] = function() {
        clearTimeout(dragTimeout);
    };

    window[`dragStart${listId}`] = function(posicao) {
        draggedItem = posicao;
    };

    window[`drop${listId}`] = function(posicao) {
        const taskItems = document.querySelectorAll(`#list-${listId} .task`);
        taskItems.forEach(item => item.classList.remove('drag-over'));
        
        if (draggedItem === posicao) return;

        const itemArrastado = minhaListaItens[draggedItem];
        minhaListaItens.splice(draggedItem, 1);
        minhaListaItens.splice(posicao, 0, itemArrastado);

        mostrarTarefa();
    };

    window[`handleTouchStart${listId}`] = function(posicao) {
        dragTimeout = setTimeout(() => {
            selectedItem = posicao;
            const selectedTask = document.querySelectorAll(`#list-${listId} .task`)[posicao];
            selectedTask.style.backgroundColor = "#6a6a6a";
        }, 1000);
    };

    window[`handleTouchEnd${listId}`] = function(posicao) {
        clearTimeout(dragTimeout);

        if (selectedItem !== null && selectedItem !== posicao) {
            trocarItens(selectedItem, posicao);
            const previouslySelectedTask = document.querySelectorAll(`#list-${listId} .task`)[selectedItem];
            previouslySelectedTask.style.backgroundColor = "";
            selectedItem = null;
        }
    };

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

    function trocarItens(primeiro, segundo) {
        const itemSelecionado = minhaListaItens[primeiro];
        minhaListaItens[primeiro] = minhaListaItens[segundo];
        minhaListaItens[segundo] = itemSelecionado;
        mostrarTarefa();
    }

    function recarregarTarefas() {
        const tarefasDoLocalStorage = localStorage.getItem(`Lista-${listId}`);
        if (tarefasDoLocalStorage) {
            minhaListaItens = JSON.parse(tarefasDoLocalStorage);
        }
        mostrarTarefa();
    }

    recarregarTarefas();
    button.addEventListener('click', adicionarNovaTarefa);

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            adicionarNovaTarefa();
        }
    });
}

document.getElementById('btnAdd').addEventListener('click', createNewList);

document.getElementById('btnRemove').addEventListener('click', function() {
    if (listCounter > 0) {
        const lastList = document.getElementById(`list-${listCounter}`);
        if (lastList) {
            lastList.remove();
            localStorage.removeItem(`Lista-${listCounter}`);
            listCounter--;
        }
    }
});

createNewList();

const modal = document.getElementById("alertModal");
const closeBtn = document.getElementById("closeAlert");
const dontShowAgainCheckbox = document.getElementById("dontShowAgain");

function showModal() {
    if (localStorage.getItem("dontShowAlertAgain") !== "true") {
        modal.style.display = "block";
    }
}

closeBtn.onclick = function() {
    modal.style.display = "none";
    if (dontShowAgainCheckbox.checked) {
        localStorage.setItem("dontShowAlertAgain", "true");
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

showModal();
