const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');

let minhaListaItens = [];
let dragTimeout = null;
let draggedItem = null;
let selectedItem = null;  // Armazena o item selecionado no modo de toque (mobile)

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
                onmousedown="startDrag(${posicao}, event)" 
                onmouseup="cancelDrag()" 
                ondragstart="dragStart(${posicao})" 
                ondragover="dragOver(event)" 
                ondrop="drop(${posicao})" 
                ontouchstart="handleTouchStart(${posicao})" 
                ontouchend="handleTouchEnd(${posicao})">
                <img src="img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao})">
                <p id="tarefa-text-${posicao}">${item.tarefa}</p>
                <img src="img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${posicao})">
                <button class="edit-btn" onclick="editarTarefa(${posicao})">Editar</button>
            </li>
        `;
    });

    listaCompleta.innerHTML = novaLi;
    localStorage.setItem('Lista', JSON.stringify(minhaListaItens));
}

// Funções para "drag and drop" com o mouse (já funcionam corretamente)
function startDrag(posicao, event) {
    dragTimeout = setTimeout(() => {
        const taskItem = event.target;
        draggedItem = posicao;
        taskItem.classList.add('draggable');
    }, 1000); // Habilita o arraste após 1 segundo
}

function cancelDrag() {
    clearTimeout(dragTimeout);
}

function dragStart(posicao) {
    draggedItem = posicao;
}

function dragOver(event) {
    event.preventDefault();
    event.target.closest('.task').classList.add('drag-over');
}

function drop(posicao) {
    const taskItems = document.querySelectorAll('.task');
    taskItems.forEach(item => item.classList.remove('drag-over'));
    
    if (draggedItem === posicao) return;

    const itemArrastado = minhaListaItens[draggedItem];
    minhaListaItens.splice(draggedItem, 1);
    minhaListaItens.splice(posicao, 0, itemArrastado);

    mostrarTarefa();
}

// Funções para toque (mobile)
function handleTouchStart(posicao) {
    // Ativa o modo de seleção após o toque e segure por 1 segundo
    dragTimeout = setTimeout(() => {
        selectedItem = posicao;
        // Muda a cor do item selecionado
        const selectedTask = document.querySelectorAll('.task')[posicao];
        selectedTask.style.backgroundColor = "#ffe680";  // Cor de destaque (amarelo claro, por exemplo)
    }, 1000);
}

function handleTouchEnd(posicao) {
    clearTimeout(dragTimeout);

    // Se o modo de seleção estiver ativo e o usuário tocar em outro item
    if (selectedItem !== null && selectedItem !== posicao) {
        trocarItens(selectedItem, posicao);
        // Volta à cor original após a troca
        const previouslySelectedTask = document.querySelectorAll('.task')[selectedItem];
        previouslySelectedTask.style.backgroundColor = "";  // Remove o estilo customizado
        selectedItem = null;  // Desativa o modo de seleção após a troca
    }
}

function trocarItens(primeiro, segundo) {
    const itemSelecionado = minhaListaItens[primeiro];
    minhaListaItens[primeiro] = minhaListaItens[segundo];
    minhaListaItens[segundo] = itemSelecionado;
    mostrarTarefa();
}

function concluirTarefa(posicao) {
    minhaListaItens[posicao].concluido = !minhaListaItens[posicao].concluido;
    mostrarTarefa();
}

function deletarItem(posicao) {
    minhaListaItens.splice(posicao, 1);
    mostrarTarefa();
}

function recarregarTarefas() {
    const tarefasDoLocalStorage = localStorage.getItem('Lista');
    if (tarefasDoLocalStorage) {
        minhaListaItens = JSON.parse(tarefasDoLocalStorage);
    }
    mostrarTarefa();
}

// Recarrega as tarefas salvas no localStorage ao carregar a página
recarregarTarefas();
button.addEventListener('click', adicionarNovaTarefa);

// Também permite adicionar a tarefa ao pressionar a tecla Enter
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        adicionarNovaTarefa();
    }
});
