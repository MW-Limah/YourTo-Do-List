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



// Adicionar e Remover Item (Tarefa)
function initializeList(container, listId) {
    const button = container.querySelector('.button-add-task');
    const input = container.querySelector('.input-task');
    const listaCompleta = container.querySelector('.list-tasks');

    let minhaListaItens = [];

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
            const isUrl = /^(http|https):\/\/[^ "]+$/.test(item.tarefa);
            const tarefaHtml = isUrl
                ? `<a href="${item.tarefa}" target="_blank">${item.tarefa}</a>`
                : item.tarefa;

            novaLi += `
                <li class="task ${item.concluido ? 'done' : ''}">
                    <img src="img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa${listId}(${posicao})">
                    <div class="marquee" id="marquee-${listId}-${posicao}">
                        <p id="tarefa-text-${listId}-${posicao}">${tarefaHtml}</p>
                    </div>
                    <img src="img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem${listId}(${posicao})">
                    <button class="edit-btn" onclick="editarTarefa${listId}(${posicao})">Editar</button>
                </li>
            `;
        });

        listaCompleta.innerHTML = novaLi;

        // Verifica o tamanho do texto e ativa o marquee se necessário
        minhaListaItens.forEach((item, posicao) => {
            const marqueeDiv = document.getElementById(`marquee-${listId}-${posicao}`);
            const textWidth = marqueeDiv.querySelector('p').scrollWidth;
            const containerWidth = marqueeDiv.clientWidth;

            if (textWidth > containerWidth) {
                marqueeDiv.classList.add('scrolling');
            }
        });

        localStorage.setItem(`Lista-${listId}`, JSON.stringify(minhaListaItens));
    }



    window[`concluirTarefa${listId}`] = function (posicao) {
        minhaListaItens[posicao].concluido = !minhaListaItens[posicao].concluido;
        mostrarTarefa();
    };

    window[`deletarItem${listId}`] = function (posicao) {
        minhaListaItens.splice(posicao, 1);
        mostrarTarefa();
    };

    window[`editarTarefa${listId}`] = function (posicao) {
        const tarefaText = document.getElementById(`tarefa-text-${listId}-${posicao}`);
        const tarefaAntiga = minhaListaItens[posicao].tarefa;

        const marqueeDiv = document.getElementById(`marquee-${listId}-${posicao}`);
        marqueeDiv.classList.remove('scrolling');
        marqueeDiv.classList.add('editing'); // Adiciona a classe editing para parar a rolagem e centralizar

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
        mostrarTarefa(); // Atualiza a lista e restaura o comportamento padrão
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

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            adicionarNovaTarefa();
        }
    });
}

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


// Eventos para Botões
document.getElementById('btnAdd').addEventListener('click', () => {
    const newListId = createNewList();
    updateListCounterInLocalStorage();
});

document.getElementById('confirmDelete').addEventListener('click', deleteList);
document.getElementById('cancelDelete').addEventListener('click', cancelDeleteList);

document.getElementById('btnRemove').addEventListener('click', function () {
    if (listCounter > 0) {
        const lastList = document.getElementById(`list-${listCounter}`);
        if (lastList) {
            confirmDeleteList(listCounter);
        }
    }
});


// Função para verificar se o alerta já foi visualizado
function checkAlertStatus() {
    const dontShow = localStorage.getItem('dontShowAlert');

    if (!dontShow) {
        document.getElementById('alertModal').style.display = 'block';
    }
}

document.getElementById('closeAlert').addEventListener('click', function () {
    const dontShowAgain = document.getElementById('dontShowAgain').checked;

    if (dontShowAgain) {
        localStorage.setItem('dontShowAlert', true);
    }

    document.getElementById('alertModal').style.display = 'none';
});

window.onload = checkAlertStatus;



// dragDropTasks.js

document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('.list-tasks');

    containers.forEach(container => {
        addDragAndDropListeners(container);
    });

    function addDragAndDropListeners(container) {
        const tasks = container.querySelectorAll('.task');

        tasks.forEach(task => {
            let isDragging = false;

            // Duplo clique para ativar o modo de arrastar
            task.addEventListener('dblclick', function () {
                isDragging = true;
                task.draggable = true; // Ativa o arraste
                task.classList.add('drag-ready');
            });

            // Ou segurar o mouse para ativar o modo de arrastar
            task.addEventListener('mousedown', function (event) {
                setTimeout(function () {
                    if (event.buttons === 1) { // Certifica que o botão esquerdo do mouse está pressionado
                        isDragging = true;
                        task.draggable = true;
                        task.classList.add('drag-ready');
                    }
                }, 500); // Aguarda meio segundo para ativar o modo de arraste
            });

            task.addEventListener('dragstart', function (event) {
                if (isDragging) {
                    event.target.classList.add('dragging');
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', event.target.dataset.position);
                }
            });

            task.addEventListener('dragend', function (event) {
                event.target.classList.remove('dragging', 'drag-ready');
                task.draggable = false; // Desativa o arraste após concluir
                isDragging = false;
            });
        });

        container.addEventListener('dragover', function (event) {
            event.preventDefault();
            const afterElement = getDragAfterElement(container, event.clientY);
            const dragging = container.querySelector('.dragging');

            if (afterElement == null) {
                container.appendChild(dragging);
            } else {
                container.insertBefore(dragging, afterElement);
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }
});


