
const button = document.querySelector('.button-add-task')
const input = document.querySelector('.input-task')
const listaCompleta = document.querySelector('.list-tasks')

let minhaListaItens = []
let dragTimeout = null
let draggedItem = null

function adicionarNovaTarefa(){
    if (input.value.trim() === '') {
        alert('Por favor, adicione uma tarefa!');
        return
    }

    minhaListaItens.push({
        tarefa: input.value,
        concluido: false
    }) 

    input.value = ''

    mostrarTarefa()
}

function mostrarTarefa(){
    let novaLi = ''

    minhaListaItens.forEach((item, posicao) => {
        novaLi += `
        <li class="task ${item.concluido && 'done'}" draggable="true" onmousedown="startDrag(${posicao}, event)" onmouseup="cancelDrag()" ondragstart="dragStart(${posicao})" ondragover="dragOver(event)" ondrop="drop(${posicao})">
            <img src="img/checked.png" alt="check-na-tarefa" onclick ="concluirTarefa(${posicao})">
            <p id="tarefa-text-${posicao}">${item.tarefa}</p>
            <img src="img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${posicao})">
            <button class="edit-btn" onclick="editarTarefa(${posicao})">Editar</button>
        </li>
        `
    })

    listaCompleta.innerHTML = novaLi

    localStorage.setItem('Lista', JSON.stringify(minhaListaItens))
}

function editarTarefa(posicao) {
    const tarefaText = document.getElementById(`tarefa-text-${posicao}`);
    const tarefaAntiga = minhaListaItens[posicao].tarefa;
    
    // Substitui o parágrafo por um campo de entrada
    tarefaText.innerHTML = `<input class="edit-input" id="edit-input-${posicao}" value="${tarefaAntiga}">`;

    const editInput = document.getElementById(`edit-input-${posicao}`);
    editInput.focus();

    // Salvar a tarefa quando sair do campo de edição ou pressionar "Enter"
    editInput.addEventListener('blur', () => salvarEdicao(posicao, editInput.value));
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            salvarEdicao(posicao, editInput.value);
        }
    });
}

function salvarEdicao(posicao, novaTarefa) {
    if (novaTarefa.trim() === '') {
        alert('O campo não pode estar vazio!');
        return;
    }

    minhaListaItens[posicao].tarefa = novaTarefa;
    mostrarTarefa();
}

input.addEventListener('keydown', function(event) { 
    if (event.key === 'Enter') {
        adicionarNovaTarefa()
}})

function concluirTarefa(posicao){ 
    minhaListaItens[posicao].concluido = !minhaListaItens[posicao].concluido
    mostrarTarefa()
}

function deletarItem(posicao){
    minhaListaItens.splice(posicao, 1)
    mostrarTarefa()
}

function recarregarTarefas(){
    const tarefaDoLocalStorrage = localStorage.getItem('Lista') 
    
    if(tarefaDoLocalStorrage){
        minhaListaItens = JSON.parse(tarefaDoLocalStorrage)
    }

    mostrarTarefa()
}

// Funções para drag and drop
function startDrag(posicao, event) {
    dragTimeout = setTimeout(() => {
        const taskItem = event.target;
        draggedItem = posicao;
        taskItem.classList.add('draggable');
    }, 5000); // Habilita o arraste após 5 segundos
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

recarregarTarefas()
button.addEventListener('click', adicionarNovaTarefa)